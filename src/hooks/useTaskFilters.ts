
import { Task, TaskCategory, TaskPriority } from '@/types/task';

export const useTaskFilters = () => {
  const getTasksByCategory = (tasks: Task[], category: TaskCategory) => {
    return tasks.filter(task => task.category === category);
  };

  const getTasksByPriority = (tasks: Task[], priority: TaskPriority) => {
    return tasks.filter(task => task.priority === priority);
  };

  const getCompletedTasks = (tasks: Task[]) => {
    return tasks.filter(task => task.completed);
  };

  const getActiveTasks = (tasks: Task[]) => {
    return tasks.filter(task => !task.completed);
  };

  return {
    getTasksByCategory,
    getTasksByPriority,
    getCompletedTasks,
    getActiveTasks
  };
};
