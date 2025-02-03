import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { ScrollArea } from "./ui/scroll-area";
import { Badge } from "./ui/badge";
import { Progress } from "./ui/progress";
import { Checkbox } from "./ui/checkbox";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { PlusCircle, Clock, CheckCircle2, AlertCircle } from "lucide-react";
import { useEvent } from "@/context/EventContext";
import { useEvents } from "@/hooks/useEvents";
import { toast } from "./ui/use-toast";

const TaskCard = ({ task, onUpdate }) => {
  const priorityColors = {
    high: "text-red-500 bg-red-50",
    medium: "text-yellow-500 bg-yellow-50",
    low: "text-green-500 bg-green-50",
  };

  const handleStatusChange = async () => {
    try {
      await onUpdate(task.id, {
        status: task.status === "completed" ? "todo" : "completed",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return (
    <Card className="mb-3 hover:shadow-md transition-shadow">
      <CardContent className="p-4 space-y-3">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-3">
            <Checkbox
              id={`task-${task.id}`}
              checked={task.status === "completed"}
              onCheckedChange={handleStatusChange}
            />
            <div>
              <h4 className="font-medium">{task.title}</h4>
              <p className="text-sm text-muted-foreground">
                {task.description}
              </p>
            </div>
          </div>
          <Badge className={priorityColors[task.priority]}>
            {task.priority}
          </Badge>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {task.assignee_id && (
              <Avatar className="h-6 w-6">
                <AvatarImage
                  src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${task.assignee_id}`}
                />
                <AvatarFallback>U</AvatarFallback>
              </Avatar>
            )}
          </div>
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <Clock className="h-4 w-4" />
            <span>{new Date(task.due_date).toLocaleDateString()}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const TaskColumn = ({ title, tasks, icon: Icon, onUpdate }) => (
  <Card className="flex-1">
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium flex items-center gap-2">
        <Icon className="h-4 w-4" />
        {title}
      </CardTitle>
      <Badge variant="outline">{tasks.length}</Badge>
    </CardHeader>
    <CardContent>
      <ScrollArea className="h-[500px] pr-4">
        {tasks.map((task) => (
          <TaskCard key={task.id} task={task} onUpdate={onUpdate} />
        ))}
      </ScrollArea>
    </CardContent>
  </Card>
);

const TaskBoard = () => {
  const { currentEvent } = useEvent();
  const { tasks, createTask, updateTask, loading } = useEvents(
    currentEvent?.id,
  );

  const todoTasks = tasks.filter((t) => t.status === "todo");
  const inProgressTasks = tasks.filter((t) => t.status === "in_progress");
  const completedTasks = tasks.filter((t) => t.status === "completed");

  const totalTasks = tasks.length;
  const completedTasksCount = completedTasks.length;
  const progress =
    totalTasks > 0 ? (completedTasksCount / totalTasks) * 100 : 0;

  const handleAddTask = async () => {
    if (!currentEvent) return;
    try {
      await createTask({
        title: "New Task",
        description: "Task description",
        status: "todo",
        priority: "medium",
        due_date: new Date().toISOString(),
        event_id: currentEvent.id,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  if (!currentEvent) {
    return (
      <div className="flex items-center justify-center h-[400px]">
        <p className="text-muted-foreground">
          Please create or select an event first
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="space-y-1">
          <h2 className="text-2xl font-semibold">Tasks</h2>
          <div className="flex items-center gap-2">
            <Progress value={progress} className="w-[200px]" />
            <span className="text-sm text-muted-foreground">
              {completedTasksCount} of {totalTasks} tasks completed
            </span>
          </div>
        </div>
        <Button onClick={handleAddTask} disabled={loading}>
          <PlusCircle className="h-4 w-4 mr-2" />
          Add Task
        </Button>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <TaskColumn
          title="To Do"
          tasks={todoTasks}
          icon={AlertCircle}
          onUpdate={updateTask}
        />
        <TaskColumn
          title="In Progress"
          tasks={inProgressTasks}
          icon={Clock}
          onUpdate={updateTask}
        />
        <TaskColumn
          title="Completed"
          tasks={completedTasks}
          icon={CheckCircle2}
          onUpdate={updateTask}
        />
      </div>
    </div>
  );
};

export default TaskBoard;
