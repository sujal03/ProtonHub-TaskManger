
import React, { createContext, useState, useContext, ReactNode } from 'react';
import { Task, TaskPriority, TaskCategory } from '@/types/task';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/contexts/AuthContext';

interface TaskContextType {
  tasks: Task[];
  addTask: (title: string, description?: string, dueDate?: string, priority?: TaskPriority, category?: TaskCategory) => Promise<void>;
  updateTask: (task: Task) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
  toggleTaskCompletion: (id: string) => Promise<void>;
  getTasksByCategory: (category: TaskCategory) => Task[];
  getTasksByPriority: (priority: TaskPriority) => Task[];
  getCompletedTasks: () => Task[];
  getActiveTasks: () => Task[];
}

const TaskContext = createContext<TaskContextType | undefined>(undefined);

export const useTaskContext = () => {
  const context = useContext(TaskContext);
  if (!context) {
    throw new Error('useTaskContext must be used within a TaskProvider');
  }
  return context;
};

export const TaskProvider = ({ children }: { children: ReactNode }) => {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  // Fetch tasks
  const { data: tasks = [] } = useQuery({
    queryKey: ['tasks'],
    queryFn: async () => {
      if (!user) return [];
      
      const { data, error } = await supabase
        .from('todos')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      // Map Supabase data structure to our application's Task type
      // The database has a 'status' column which contains either 'completed' or 'active'
      // But it does not have a 'category' column, so we'll use the 'status' field to store the category
      // for now, or set a default of 'other'
      return data.map(item => ({
        id: item.id,
        title: item.title,
        description: item.description || '',
        completed: item.status === 'completed',
        priority: (item.priority as TaskPriority) || 'medium',
        // Using the priority field to store the category since there is no category column
        // This is a temporary solution; ideally we would add a category column to the database
        category: (item.priority?.includes(':') ? item.priority.split(':')[1] as TaskCategory : 'other'),
        dueDate: item.due_date || undefined,
        createdAt: item.created_at,
        updatedAt: item.created_at
      })) as Task[];
    },
    enabled: !!user
  });

  // Add task mutation
  const addTaskMutation = useMutation({
    mutationFn: async (newTask: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => {
      if (!user) throw new Error('User not authenticated');
      
      console.log('Adding task:', newTask); // Debug log to see what's being sent
      
      // Store category in the priority field using a prefix
      // Format: "actual_priority:category"
      const priorityWithCategory = `${newTask.priority}:${newTask.category}`;
      
      const { data, error } = await supabase
        .from('todos')
        .insert([{
          title: newTask.title,
          description: newTask.description,
          status: newTask.completed ? 'completed' : 'active',
          priority: priorityWithCategory, // Store both priority and category
          due_date: newTask.dueDate,
          user_id: user.id
        }])
        .select()
        .single();

      if (error) {
        console.error('Supabase error:', error); // Debug log for errors
        throw error;
      }
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      toast({
        title: "Task created",
        description: "Your task has been created successfully."
      });
    },
    onError: (error) => {
      console.error('Error adding task:', error); // Debug log for errors
      toast({
        title: "Error",
        description: "Failed to create task. Please try again.",
        variant: "destructive"
      });
    }
  });

  // Update task mutation
  const updateTaskMutation = useMutation({
    mutationFn: async (task: Task) => {
      // Store category in the priority field using the same format as in addTask
      const priorityWithCategory = `${task.priority}:${task.category}`;
      
      const { error } = await supabase
        .from('todos')
        .update({
          title: task.title,
          description: task.description,
          status: task.completed ? 'completed' : 'active',
          priority: priorityWithCategory, // Store both priority and category
          due_date: task.dueDate,
        })
        .eq('id', task.id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      toast({
        title: "Task updated",
        description: "Your task has been updated successfully."
      });
    }
  });

  // Delete task mutation
  const deleteTaskMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('todos')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      toast({
        title: "Task deleted",
        description: "Your task has been deleted.",
        variant: "destructive"
      });
    }
  });

  const addTask = async (
    title: string,
    description?: string,
    dueDate?: string,
    priority: TaskPriority = 'medium',
    category: TaskCategory = 'other'
  ) => {
    console.log('addTask called with:', { title, description, dueDate, priority, category }); // Debug log
    
    try {
      await addTaskMutation.mutateAsync({
        title,
        description,
        dueDate,
        priority,
        category,
        completed: false
      });
    } catch (error) {
      console.error('Error in addTask:', error); // Debug log
    }
  };

  const updateTask = async (task: Task) => {
    await updateTaskMutation.mutateAsync(task);
  };

  const deleteTask = async (id: string) => {
    await deleteTaskMutation.mutateAsync(id);
  };

  const toggleTaskCompletion = async (id: string) => {
    const task = tasks.find(t => t.id === id);
    if (task) {
      await updateTaskMutation.mutateAsync({
        ...task,
        completed: !task.completed
      });
    }
  };

  const getTasksByCategory = (category: TaskCategory) => {
    return tasks.filter(task => task.category === category);
  };

  const getTasksByPriority = (priority: TaskPriority) => {
    return tasks.filter(task => task.priority === priority);
  };

  const getCompletedTasks = () => {
    return tasks.filter(task => task.completed);
  };

  const getActiveTasks = () => {
    return tasks.filter(task => !task.completed);
  };

  return (
    <TaskContext.Provider
      value={{
        tasks,
        addTask,
        updateTask,
        deleteTask,
        toggleTaskCompletion,
        getTasksByCategory,
        getTasksByPriority,
        getCompletedTasks,
        getActiveTasks,
      }}
    >
      {children}
    </TaskContext.Provider>
  );
};

