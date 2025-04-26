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
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100 relative overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute w-80 h-80 bg-indigo-300 rounded-full opacity-20 blur-3xl top-0 -left-20 animate-pulse"></div>
      <div className="absolute w-96 h-96 bg-pink-300 rounded-full opacity-15 blur-3xl bottom-0 -right-20 animate-pulse-slow"></div>
      <div className="absolute w-64 h-64 bg-purple-200 rounded-full opacity-25 blur-2xl top-1/3 left-1/4 animate-pulse"></div>

      <Header />
      <TaskProvider>
        <div className="container mx-auto px-4 py-10">
          <div className="max-w-5xl mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10">
              <div>
                <h2 className="text-3xl font-bold tracking-tight text-gray-900">Task Dashboard</h2>
                <p className="text-gray-600 text-lg font-medium mt-2">Organize and manage your tasks with ease</p>
              </div>
              <div className="mt-6 md:mt-0">
                <AddTaskDialog />
              </div>
            </div>

            <div className="bg-white/30 backdrop-blur-xl shadow-xl border border-white/20 rounded-3xl p-6 mb-8 transition-all duration-300 hover:shadow-2xl">
              <TaskStatistics />
            </div>

            <Separator className="my-10 bg-gray-200/50" />

            <Tabs defaultValue="all" className="w-full">
              <TabsList className="grid grid-cols-3 w-full max-w-md mb-6 bg-white/30 backdrop-blur-md border border-white/20 rounded-xl p-1">
                <TabsTrigger 
                  value="all" 
                  className="py-2 rounded-lg text-gray-700 font-medium data-[state=active]:bg-indigo-600 data-[state=active]:text-white data-[state=active]:shadow-md transition-all duration-200 hover:bg-indigo-50"
                >
                  All Tasks
                </TabsTrigger>
                <TabsTrigger 
                  value="active" 
                  className="py-2 rounded-lg text-gray-700 font-medium data-[state=active]:bg-indigo-600 data-[state=active]:text-white data-[state=active]:shadow-md transition-all duration-200 hover:bg-indigo-50"
                >
                  Active
                </TabsTrigger>
                <TabsTrigger 
                  value="completed" 
                  className="py-2 rounded-lg text-gray-700 font-medium data-[state=active]:bg-indigo-600 data-[state=active]:text-white data-[state=active]:shadow-md transition-all duration-200 hover:bg-indigo-50"
                >
                  Completed
                </TabsTrigger>
              </TabsList>

              <TabsContent value="all" className="mt-0">
                <TaskList />
              </TabsContent>
              <TabsContent value="active" className="mt-0">
                <TaskList filter="active" />
              </TabsContent>
              <TabsContent value="completed" className="mt-0">
                <TaskList filter="completed" />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </TaskProvider>
    </div>
  );
};

export default Index;