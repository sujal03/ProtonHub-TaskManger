
import React, { createContext, useContext, ReactNode } from 'react';
import { Task, TaskPriority, TaskCategory } from '@/types/task';
import { useTaskQueries } from '@/hooks/useTaskQueries';
import { useTaskFilters } from '@/hooks/useTaskFilters';

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
  const { tasks, addTaskMutation, updateTaskMutation, deleteTaskMutation } = useTaskQueries();
  const { getTasksByCategory, getTasksByPriority, getCompletedTasks, getActiveTasks } = useTaskFilters();

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

  return (
    <TaskContext.Provider
      value={{
        tasks,
        addTask,
        updateTask,
        deleteTask,
        toggleTaskCompletion,
        getTasksByCategory: (category) => getTasksByCategory(tasks, category),
        getTasksByPriority: (priority) => getTasksByPriority(tasks, priority),
        getCompletedTasks: () => getCompletedTasks(tasks),
        getActiveTasks: () => getActiveTasks(tasks)
      }}
    >
      {children}
    </TaskContext.Provider>
  );
};
