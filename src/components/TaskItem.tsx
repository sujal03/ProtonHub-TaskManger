
import React from 'react';
import { Task } from '@/types/task';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Edit, Trash2, Calendar, Tag } from 'lucide-react';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { Badge } from '@/components/ui/badge';

interface TaskItemProps {
  task: Task;
  onToggleComplete: (id: string) => void;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
}

const TaskItem: React.FC<TaskItemProps> = ({
  task,
  onToggleComplete,
  onEdit,
  onDelete
}) => {
  const priorityColors = {
    low: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
    medium: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
    high: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
  };

  return (
    <div className="group p-4 border rounded-md mb-3 hover:border-todo-light transition-all bg-white dark:bg-gray-900 shadow-sm hover:shadow-md animate-fade-in">
      <div className="flex items-start">
        <Checkbox 
          className="mt-1 mr-3" 
          checked={task.completed} 
          onCheckedChange={() => onToggleComplete(task.id)}
        />
        
        <div className="flex-grow">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <h3 className={cn(
              "font-medium text-lg",
              task.completed && "task-done"
            )}>
              {task.title}
            </h3>
            
            <div className="flex space-x-1 mt-2 sm:mt-0">
              <Badge variant="outline" className={priorityColors[task.priority]}>
                {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
              </Badge>
              <Badge variant="outline" className="bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300">
                {task.category}
              </Badge>
            </div>
          </div>
          
          {task.description && (
            <p className={cn(
              "text-gray-600 dark:text-gray-400 mt-1",
              task.completed && "task-done"
            )}>
              {task.description}
            </p>
          )}
          
          <div className="mt-3 flex flex-wrap gap-2 text-sm text-gray-500 dark:text-gray-400">
            {task.dueDate && (
              <div className="flex items-center">
                <Calendar className="h-3.5 w-3.5 mr-1" />
                <span>Due: {format(new Date(task.dueDate), 'MMM d, yyyy')}</span>
              </div>
            )}
            {task.tags && task.tags.length > 0 && (
              <div className="flex items-center">
                <Tag className="h-3.5 w-3.5 mr-1" />
                <span>{task.tags.join(', ')}</span>
              </div>
            )}
          </div>
        </div>
        
        <div className="ml-3 flex gap-1">
          <Button size="sm" variant="outline" onClick={() => onEdit(task)}>
            <Edit className="h-4 w-4" />
            <span className="sr-only">Edit</span>
          </Button>
          <Button size="sm" variant="outline" className="text-red-500 hover:text-red-700" onClick={() => onDelete(task.id)}>
            <Trash2 className="h-4 w-4" />
            <span className="sr-only">Delete</span>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TaskItem;
