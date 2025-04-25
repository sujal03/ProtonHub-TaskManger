
import React from 'react';
import { useTaskContext } from '@/contexts/TaskContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { CheckCircle, Circle, Clock } from 'lucide-react';

export default function TaskStatistics() {
  const { tasks, getActiveTasks, getCompletedTasks } = useTaskContext();
  
  const completedTasks = getCompletedTasks();
  const activeTasks = getActiveTasks();
  
  const completionRate = tasks.length > 0 
    ? Math.round((completedTasks.length / tasks.length) * 100) 
    : 0;
    
  const getDueTasks = () => {
    const now = new Date();
    return activeTasks.filter(task => {
      if (!task.dueDate) return false;
      const dueDate = new Date(task.dueDate);
      return dueDate >= now && dueDate <= new Date(now.setDate(now.getDate() + 7));
    });
  };
  
  const dueTasks = getDueTasks();
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Completion Rate</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{completionRate}%</div>
          <Progress value={completionRate} className="h-2 mt-2" />
          <p className="text-xs text-muted-foreground mt-2">
            {completedTasks.length} of {tasks.length} tasks completed
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Active Tasks</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center">
            <Circle className="h-5 w-5 mr-2 text-todo" />
            <div className="text-2xl font-bold">{activeTasks.length}</div>
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            Tasks that need to be completed
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Due Soon</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center">
            <Clock className="h-5 w-5 mr-2 text-yellow-500" />
            <div className="text-2xl font-bold">{dueTasks.length}</div>
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            Tasks due within the next 7 days
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
