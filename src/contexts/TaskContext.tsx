
import React, { createContext, useState, useContext, ReactNode } from 'react';
import { Task, TaskPriority, TaskCategory } from '@/types/task';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

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

  // Fetch tasks
  const { data: tasks = [] } = useQuery({
    queryKey: ['tasks'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('todos')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as Task[];
    }
  });

  // Add task mutation
  const addTaskMutation = useMutation({
    mutationFn: async (newTask: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => {
      const { data, error } = await supabase
        .from('todos')
        .insert([newTask])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      toast({
        title: "Task created",
        description: "Your task has been created successfully."
      });
    }
  });

  // Update task mutation
  const updateTaskMutation = useMutation({
    mutationFn: async (task: Task) => {
      const { error } = await supabase
        .from('todos')
        .update({
          title: task.title,
          description: task.description,
          completed: task.completed,
          priority: task.priority,
          category: task.category,
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
    await addTaskMutation.mutateAsync({
      title,
      description,
      dueDate,
      priority,
      category,
      completed: false
    });
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
