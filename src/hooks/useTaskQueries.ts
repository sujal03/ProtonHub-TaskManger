
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Task, TaskPriority, TaskCategory } from '@/types/task';
import { toast } from '@/hooks/use-toast';
import { mapDbTaskToTask, createPriorityWithCategory } from '@/utils/taskUtils';
import { useAuth } from '@/contexts/AuthContext';

export const useTaskQueries = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();

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
      
      return data.map(mapDbTaskToTask);
    },
    enabled: !!user
  });

  const addTaskMutation = useMutation({
    mutationFn: async (newTask: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => {
      if (!user) throw new Error('User not authenticated');
      
      const priorityWithCategory = createPriorityWithCategory(newTask.priority, newTask.category);
      
      const { data, error } = await supabase
        .from('todos')
        .insert([{
          title: newTask.title,
          description: newTask.description,
          status: newTask.completed ? 'completed' : 'active',
          priority: priorityWithCategory,
          due_date: newTask.dueDate,
          user_id: user.id
        }])
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
    },
    onError: (error) => {
      console.error('Error adding task:', error);
      toast({
        title: "Error",
        description: "Failed to create task. Please try again.",
        variant: "destructive"
      });
    }
  });

  const updateTaskMutation = useMutation({
    mutationFn: async (task: Task) => {
      const priorityWithCategory = createPriorityWithCategory(task.priority, task.category);
      
      const { error } = await supabase
        .from('todos')
        .update({
          title: task.title,
          description: task.description,
          status: task.completed ? 'completed' : 'active',
          priority: priorityWithCategory,
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

  return {
    tasks,
    addTaskMutation,
    updateTaskMutation,
    deleteTaskMutation
  };
};
