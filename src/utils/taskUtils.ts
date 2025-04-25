
import { Task, TaskPriority, TaskCategory } from '@/types/task';
import { Database } from '@/integrations/supabase/types';

type DbTask = Database['public']['Tables']['todos']['Row'];

export const mapDbTaskToTask = (item: DbTask): Task => ({
  id: item.id,
  title: item.title,
  description: item.description || '',
  completed: item.status === 'completed',
  priority: extractPriorityFromDb(item.priority),
  category: extractCategoryFromDb(item.priority),
  dueDate: item.due_date || undefined,
  createdAt: item.created_at || '',
  updatedAt: item.created_at || ''
});

export const extractPriorityFromDb = (priority: string | null): TaskPriority => {
  if (!priority) return 'medium';
  const parts = priority.split(':');
  return (parts[0] as TaskPriority) || 'medium';
};

export const extractCategoryFromDb = (priority: string | null): TaskCategory => {
  if (!priority) return 'other';
  const parts = priority.split(':');
  return (parts[1] as TaskCategory) || 'other';
};

export const createPriorityWithCategory = (priority: TaskPriority, category: TaskCategory): string => {
  return `${priority}:${category}`;
};
