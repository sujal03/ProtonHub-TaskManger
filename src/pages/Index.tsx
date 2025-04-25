
import React from 'react';
import { TaskProvider } from '@/contexts/TaskContext';
import TaskList from '@/components/TaskList';
import AddTaskDialog from '@/components/AddTaskDialog';
import TaskStatistics from '@/components/TaskStatistics';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';

const Index = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <TaskProvider>
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold">Task Forge</h1>
              <p className="text-muted-foreground">Manage and organize your tasks efficiently</p>
            </div>
            <div className="mt-4 md:mt-0">
              <AddTaskDialog />
            </div>
          </div>
          
          <TaskStatistics />
          
          <Separator className="my-8" />
          
          <Tabs defaultValue="all" className="w-full">
            <TabsList className="grid grid-cols-3 w-full max-w-md mb-4">
              <TabsTrigger value="all">All Tasks</TabsTrigger>
              <TabsTrigger value="active">Active</TabsTrigger>
              <TabsTrigger value="completed">Completed</TabsTrigger>
            </TabsList>
            
            <TaskList />
          </Tabs>
        </div>
      </TaskProvider>
    </div>
  );
};

export default Index;
