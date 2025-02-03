import React from "react";
import { Card } from "./ui/card";
import { ScrollArea } from "./ui/scroll-area";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "./ui/hover-card";
import { Button } from "./ui/button";
import { Calendar, Clock, MapPin, Users, Plus } from "lucide-react";

interface Template {
  id: string;
  name: string;
  description: string;
  type: string;
  attendees: number;
  duration: string;
  location: string;
}

interface TemplateSidebarProps {
  templates?: Template[];
  onTemplateSelect?: (template: Template) => void;
}

const defaultTemplates: Template[] = [
  {
    id: "1",
    name: "Corporate Conference",
    description:
      "Standard setup for business conferences with presentation areas",
    type: "Business",
    attendees: 100,
    duration: "8 hours",
    location: "Conference Center",
  },
  {
    id: "2",
    name: "Wedding Reception",
    description: "Traditional wedding reception layout with dance floor",
    type: "Social",
    attendees: 150,
    duration: "6 hours",
    location: "Banquet Hall",
  },
  {
    id: "3",
    name: "Birthday Party",
    description: "Casual party setup with entertainment area",
    type: "Social",
    attendees: 30,
    duration: "4 hours",
    location: "Private Venue",
  },
];

const TemplateCard = ({ template }: { template: Template }) => (
  <Card className="p-4 mb-3 hover:shadow-lg transition-shadow bg-white">
    <h3 className="font-semibold text-lg mb-2">{template.name}</h3>
    <div className="text-sm text-gray-500 space-y-2">
      <div className="flex items-center gap-2">
        <Users size={16} />
        <span>{template.attendees} attendees</span>
      </div>
      <div className="flex items-center gap-2">
        <Clock size={16} />
        <span>{template.duration}</span>
      </div>
      <div className="flex items-center gap-2">
        <MapPin size={16} />
        <span>{template.location}</span>
      </div>
    </div>
  </Card>
);

const TemplateSidebar = ({
  templates = defaultTemplates,
  onTemplateSelect = () => {},
}: TemplateSidebarProps) => {
  return (
    <div className="w-[280px] h-full bg-gray-50 border-l border-gray-200 p-4">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold">Templates</h2>
        <Button variant="outline" size="icon">
          <Plus size={20} />
        </Button>
      </div>

      <ScrollArea className="h-[calc(100%-4rem)]">
        {templates.map((template) => (
          <HoverCard key={template.id}>
            <HoverCardTrigger asChild>
              <div
                onClick={() => onTemplateSelect(template)}
                className="cursor-pointer"
              >
                <TemplateCard template={template} />
              </div>
            </HoverCardTrigger>
            <HoverCardContent className="w-80">
              <div className="space-y-2">
                <h4 className="text-sm font-semibold">{template.name}</h4>
                <p className="text-sm text-gray-500">{template.description}</p>
                <div className="pt-2">
                  <span className="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800">
                    {template.type}
                  </span>
                </div>
              </div>
            </HoverCardContent>
          </HoverCard>
        ))}
      </ScrollArea>
    </div>
  );
};

export default TemplateSidebar;
