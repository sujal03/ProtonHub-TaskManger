
import React, { createContext, useState, useContext, ReactNode } from 'react';
import { Task, TaskPriority, TaskCategory } from '@/types/task';
import { v4 as uuidv4 } from 'uuid';
import { toast } from '@/hooks/use-toast';

interface TaskContextType {
  tasks: Task[];
  addTask: (title: string, description?: string, dueDate?: string, priority?: TaskPriority, category?: TaskCategory) => void;
  updateTask: (task: Task) => void;
  deleteTask: (id: string) => void;
  toggleTaskCompletion: (id: string) => void;
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
  const [tasks, setTasks] = useState<Task[]>(() => {
    const savedTasks = localStorage.getItem('tasks');
    if (savedTasks) {
      try {
        return JSON.parse(savedTasks);
      } catch (error) {
        console.error('Failed to parse saved tasks', error);
        return [];
      }
    }
    return [];
  });

  // Save tasks to local storage whenever they change
  React.useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);

  const addTask = (
    title: string, 
    description?: string, 
    dueDate?: string, 
    priority: TaskPriority = 'medium', 
    category: TaskCategory = 'other'
  ) => {
    const now = new Date().toISOString();
    const newTask: Task = {
      id: uuidv4(),
      title,
      description,
      completed: false,
      createdAt: now,
      updatedAt: now,
      dueDate,
      priority,
      category,
    };
    
    setTasks(prev => [newTask, ...prev]);
    toast({
      title: "Task created",
      description: `"${title}" has been added to your tasks.`,
    });
  };

  const updateTask = (updatedTask: Task) => {
    setTasks(prev => prev.map(task => 
      task.id === updatedTask.id ? { ...updatedTask, updatedAt: new Date().toISOString() } : task
    ));
    
    toast({
      title: "Task updated",
      description: "Your task has been updated successfully.",
    });
  };

  const deleteTask = (id: string) => {
    const taskToDelete = tasks.find(task => task.id === id);
    setTasks(prev => prev.filter(task => task.id !== id));
    
    if (taskToDelete) {
      toast({
        title: "Task deleted",
        description: `"${taskToDelete.title}" has been removed.`,
        variant: "destructive"
      });
    }
  };

  const toggleTaskCompletion = (id: string) => {
    setTasks(prev => 
      prev.map(task => 
        task.id === id 
          ? { ...task, completed: !task.completed, updatedAt: new Date().toISOString() } 
          : task
      )
    );
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
