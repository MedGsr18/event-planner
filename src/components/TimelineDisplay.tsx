import React from "react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { PlusCircle, Circle, CheckCircle } from "lucide-react";
import { motion } from "framer-motion";

interface Milestone {
  id: string;
  title: string;
  date: string;
  completed: boolean;
}

interface TimelineDisplayProps {
  milestones?: Milestone[];
  onMilestoneClick?: (id: string) => void;
  onAddMilestone?: () => void;
}

const defaultMilestones: Milestone[] = [
  {
    id: "1",
    title: "Initial Planning",
    date: "2024-03-01",
    completed: true,
  },
  {
    id: "2",
    title: "Venue Selection",
    date: "2024-03-15",
    completed: false,
  },
  {
    id: "3",
    title: "Send Invitations",
    date: "2024-04-01",
    completed: false,
  },
];

const TimelineDisplay = ({
  milestones = defaultMilestones,
  onMilestoneClick = () => {},
  onAddMilestone = () => {},
}: TimelineDisplayProps) => {
  return (
    <Card className="p-6 bg-white w-full h-[200px] overflow-hidden">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Event Timeline</h2>
        <Button
          variant="outline"
          size="sm"
          onClick={onAddMilestone}
          className="flex items-center gap-2"
        >
          <PlusCircle className="h-4 w-4" />
          Add Milestone
        </Button>
      </div>

      <div className="relative">
        {/* Timeline line */}
        <div className="absolute left-2 top-0 bottom-0 w-0.5 bg-gray-200" />

        {/* Milestones */}
        <div className="space-y-4">
          {milestones.map((milestone, index) => (
            <motion.div
              key={milestone.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-center gap-4 relative"
              onClick={() => onMilestoneClick(milestone.id)}
            >
              {milestone.completed ? (
                <CheckCircle className="h-5 w-5 text-green-500" />
              ) : (
                <Circle className="h-5 w-5 text-gray-400" />
              )}
              <div className="flex-1">
                <p className="font-medium">{milestone.title}</p>
                <p className="text-sm text-gray-500">{milestone.date}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </Card>
  );
};

export default TimelineDisplay;
