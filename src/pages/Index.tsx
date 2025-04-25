
import React from 'react';
import { TaskProvider } from '@/contexts/TaskContext';
import TaskList from '@/components/TaskList';
import AddTaskDialog from '@/components/AddTaskDialog';
import TaskStatistics from '@/components/TaskStatistics';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import Header from '@/components/Header';

const Index = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <TaskProvider>
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-5xl mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
              <div>
                <h2 className="text-2xl font-semibold">Dashboard</h2>
                <p className="text-muted-foreground">Manage and organize your tasks efficiently</p>
              </div>
              <div className="mt-4 md:mt-0">
                <AddTaskDialog />
              </div>
            </div>
            
            <TaskStatistics />
            
            <Separator className="my-8" />
            
            <Tabs defaultValue="all" className="w-full">
              {/* <TabsList className="grid grid-cols-3 w-full max-w-md mb-4">
                <TabsTrigger value="all">All Tasks</TabsTrigger>
                <TabsTrigger value="active">Active</TabsTrigger>
                <TabsTrigger value="completed">Completed</TabsTrigger>
              </TabsList> */}
              
              <TaskList />
            </Tabs>
          </div>
        </div>
      </TaskProvider>
    </div>
  );
};

export default Index;
