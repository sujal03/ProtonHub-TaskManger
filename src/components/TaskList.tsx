
import React, { useState } from 'react';
import { Task } from '@/types/task';
import TaskItem from '@/components/TaskItem';
import { useTaskContext } from '@/contexts/TaskContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Search, X, Filter } from 'lucide-react';
import TaskForm from '@/components/TaskForm';
import { Badge } from '@/components/ui/badge';

export default function TaskList() {
  const { tasks, updateTask, deleteTask, toggleTaskCompletion } = useTaskContext();
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string | null>(null);
  const [priorityFilter, setPriorityFilter] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [editTask, setEditTask] = useState<Task | null>(null);

  // Filter tasks based on search term and filters
  const filteredTasks = tasks.filter(task => {
    const matchesSearch = 
      searchTerm === '' || 
      task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (task.description && task.description.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesCategory = categoryFilter === null || task.category === categoryFilter;
    const matchesPriority = priorityFilter === null || task.priority === priorityFilter;
    const matchesStatus = statusFilter === null || 
      (statusFilter === 'completed' ? task.completed : !task.completed);
    
    return matchesSearch && matchesCategory && matchesPriority && matchesStatus;
  });

  const handleEditTask = (task: Task) => {
    setEditTask(task);
  };

  const handleUpdateTask = (formData: any) => {
    if (editTask) {
      const updatedTask = {
        ...editTask,
        title: formData.title,
        description: formData.description || '',
        priority: formData.priority,
        category: formData.category,
        dueDate: formData.dueDate?.toISOString(),
      };
      updateTask(updatedTask);
      setEditTask(null);
    }
  };

  const clearFilters = () => {
    setSearchTerm('');
    setCategoryFilter(null);
    setPriorityFilter(null);
    setStatusFilter(null);
  };

  const activeFiltersCount = [
    searchTerm !== '', 
    categoryFilter !== null, 
    priorityFilter !== null, 
    statusFilter !== null
  ].filter(Boolean).length;

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-2">
        <div className="relative flex-grow">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
          <Input
            type="text"
            placeholder="Search tasks..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="flex flex-wrap gap-2">
          <Select onValueChange={(value) => setCategoryFilter(value === 'all' ? null : value)} value={categoryFilter || 'all'}>
            <SelectTrigger className="w-[130px]">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="work">Work</SelectItem>
              <SelectItem value="personal">Personal</SelectItem>
              <SelectItem value="shopping">Shopping</SelectItem>
              <SelectItem value="health">Health</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
          
          <Select onValueChange={(value) => setPriorityFilter(value === 'all' ? null : value)} value={priorityFilter || 'all'}>
            <SelectTrigger className="w-[130px]">
              <SelectValue placeholder="Priority" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Priorities</SelectItem>
              <SelectItem value="low">Low</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="high">High</SelectItem>
            </SelectContent>
          </Select>
          
          <Select onValueChange={(value) => setStatusFilter(value === 'all' ? null : value)} value={statusFilter || 'all'}>
            <SelectTrigger className="w-[130px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
            </SelectContent>
          </Select>
          
          {activeFiltersCount > 0 && (
            <Button variant="ghost" onClick={clearFilters} className="px-2">
              <Badge className="mr-1">{activeFiltersCount}</Badge>
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>

      <div className="mt-6">
        {filteredTasks.length === 0 ? (
          <div className="text-center py-8 border border-dashed rounded-md">
            <p className="text-gray-500">No tasks found</p>
            <p className="text-sm text-gray-400 mt-1">
              {tasks.length > 0 
                ? 'Try adjusting your filters or search term' 
                : 'Start by adding your first task'}
            </p>
          </div>
        ) : (
          filteredTasks.map(task => (
            <TaskItem
              key={task.id}
              task={task}
              onToggleComplete={toggleTaskCompletion}
              onEdit={handleEditTask}
              onDelete={deleteTask}
            />
          ))
        )}
      </div>

      <Dialog open={editTask !== null} onOpenChange={(open) => !open && setEditTask(null)}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Edit Task</DialogTitle>
          </DialogHeader>
          {editTask && (
            <TaskForm 
              initialTask={editTask} 
              onSubmit={handleUpdateTask}
              onCancel={() => setEditTask(null)}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
