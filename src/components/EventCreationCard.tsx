import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Calendar } from "./ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { cn } from "../lib/utils";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { useEvent } from "@/context/EventContext";
import { toast } from "./ui/use-toast";

interface EventFormData {
  title: string;
  date: Date;
  location: string;
  description: string;
  theme: string;
  type: string;
}

const EventCreationCard: React.FC = () => {
  const { createEvent, loading } = useEvent();
  const [formData, setFormData] = React.useState<EventFormData>({
    title: "",
    date: new Date(),
    location: "",
    description: "",
    theme: "modern",
    type: "corporate",
  });

  const handleSubmit = async () => {
    try {
      await createEvent({
        ...formData,
        date: formData.date.toISOString(),
      });
      toast({
        title: "Success",
        description: "Event created successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleInputChange = (field: keyof EventFormData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <Card className="w-[800px] bg-white shadow-lg">
      <CardHeader>
        <CardTitle className="text-2xl font-semibold text-gray-800">
          Create New Event
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="title">Event Title</Label>
          <Input
            id="title"
            placeholder="Enter event title"
            value={formData.title}
            onChange={(e) => handleInputChange("title", e.target.value)}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Event Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !formData.date && "text-muted-foreground",
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {formData.date ? (
                    format(formData.date, "PPP")
                  ) : (
                    <span>Pick a date</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={formData.date}
                  onSelect={(date) => handleInputChange("date", date)}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="space-y-2">
            <Label htmlFor="location">Location</Label>
            <Input
              id="location"
              placeholder="Enter event location"
              value={formData.location}
              onChange={(e) => handleInputChange("location", e.target.value)}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Event Type</Label>
            <Select
              value={formData.type}
              onValueChange={(value) => handleInputChange("type", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select event type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="corporate">Corporate</SelectItem>
                <SelectItem value="wedding">Wedding</SelectItem>
                <SelectItem value="birthday">Birthday</SelectItem>
                <SelectItem value="conference">Conference</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Theme</Label>
            <Select
              value={formData.theme}
              onValueChange={(value) => handleInputChange("theme", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select theme" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="modern">Modern</SelectItem>
                <SelectItem value="classic">Classic</SelectItem>
                <SelectItem value="rustic">Rustic</SelectItem>
                <SelectItem value="minimalist">Minimalist</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            placeholder="Enter event description"
            className="min-h-[100px]"
            value={formData.description}
            onChange={(e) => handleInputChange("description", e.target.value)}
          />
        </div>

        <div className="flex justify-end space-x-2">
          <Button
            variant="outline"
            onClick={() =>
              setFormData({
                title: "",
                date: new Date(),
                location: "",
                description: "",
                theme: "modern",
                type: "corporate",
              })
            }
          >
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={loading}>
            {loading ? "Creating..." : "Create Event"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default EventCreationCard;
