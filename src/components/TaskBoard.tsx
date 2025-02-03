import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { ScrollArea } from "./ui/scroll-area";
import { Badge } from "./ui/badge";
import { Progress } from "./ui/progress";
import { Checkbox } from "./ui/checkbox";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { PlusCircle, Clock, CheckCircle2, AlertCircle } from "lucide-react";

interface Task {
  id: string;
  title: string;
  description: string;
  status: "todo" | "in_progress" | "completed";
  priority: "high" | "medium" | "low";
  assignee: {
    name: string;
    avatar: string;
  };
  dueDate: string;
}

interface TaskBoardProps {
  tasks?: Task[];
  onTaskAdd?: () => void;
  onTaskUpdate?: (id: string, updates: Partial<Task>) => void;
}

const defaultTasks: Task[] = [
  {
    id: "1",
    title: "Finalize venue decorations",
    description: "Select and confirm all decorative elements with the vendor",
    status: "in_progress",
    priority: "high",
    assignee: {
      name: "Sarah",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah",
    },
    dueDate: "2024-03-20",
  },
  {
    id: "2",
    title: "Coordinate with caterers",
    description: "Review menu options and dietary requirements",
    status: "todo",
    priority: "medium",
    assignee: {
      name: "Mike",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Mike",
    },
    dueDate: "2024-03-25",
  },
  {
    id: "3",
    title: "Send vendor payments",
    description: "Process final payments for confirmed vendors",
    status: "completed",
    priority: "high",
    assignee: {
      name: "Alex",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alex",
    },
    dueDate: "2024-03-15",
  },
];

const TaskCard = ({ task }: { task: Task }) => {
  const priorityColors = {
    high: "text-red-500 bg-red-50",
    medium: "text-yellow-500 bg-yellow-50",
    low: "text-green-500 bg-green-50",
  };

  return (
    <Card className="mb-3 hover:shadow-md transition-shadow">
      <CardContent className="p-4 space-y-3">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-3">
            <Checkbox id={`task-${task.id}`} />
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
            <Avatar className="h-6 w-6">
              <AvatarImage src={task.assignee.avatar} />
              <AvatarFallback>{task.assignee.name[0]}</AvatarFallback>
            </Avatar>
            <span className="text-sm text-muted-foreground">
              {task.assignee.name}
            </span>
          </div>
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <Clock className="h-4 w-4" />
            <span>{task.dueDate}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const TaskColumn = ({
  title,
  tasks,
  icon: Icon,
}: {
  title: string;
  tasks: Task[];
  icon: any;
}) => (
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
          <TaskCard key={task.id} task={task} />
        ))}
      </ScrollArea>
    </CardContent>
  </Card>
);

const TaskBoard: React.FC<TaskBoardProps> = ({
  tasks = defaultTasks,
  onTaskAdd = () => {},
  onTaskUpdate = () => {},
}) => {
  const todoTasks = tasks.filter((t) => t.status === "todo");
  const inProgressTasks = tasks.filter((t) => t.status === "in_progress");
  const completedTasks = tasks.filter((t) => t.status === "completed");

  const totalTasks = tasks.length;
  const completedTasksCount = completedTasks.length;
  const progress = (completedTasksCount / totalTasks) * 100;

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
        <Button onClick={onTaskAdd}>
          <PlusCircle className="h-4 w-4 mr-2" />
          Add Task
        </Button>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <TaskColumn title="To Do" tasks={todoTasks} icon={AlertCircle} />
        <TaskColumn title="In Progress" tasks={inProgressTasks} icon={Clock} />
        <TaskColumn
          title="Completed"
          tasks={completedTasks}
          icon={CheckCircle2}
        />
      </div>
    </div>
  );
};

export default TaskBoard;
