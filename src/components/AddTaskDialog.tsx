
import React from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus } from 'lucide-react';
import TaskForm from '@/components/TaskForm';
import { useTaskContext } from '@/contexts/TaskContext';

export default function AddTaskDialog() {
  const { addTask } = useTaskContext();
  const [open, setOpen] = React.useState(false);

  const handleSubmit = (data: any) => {
    addTask(
      data.title, 
      data.description, 
      data.dueDate?.toISOString(), 
      data.priority, 
      data.category
    );
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-todo hover:bg-todo-dark">
          <Plus className="mr-1 h-4 w-4" />
          New Task
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Create New Task</DialogTitle>
        </DialogHeader>
        <TaskForm onSubmit={handleSubmit} />
      </DialogContent>
    </Dialog>
  );
}
