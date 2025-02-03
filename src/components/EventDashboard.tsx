import React from "react";
import EventCreationCard from "./EventCreationCard";
import TimelineDisplay from "./TimelineDisplay";
import BudgetTracker from "./BudgetTracker";
import TemplateSidebar from "./TemplateSidebar";
import VendorDirectory from "./VendorDirectory";
import GuestList from "./GuestList";
import TaskBoard from "./TaskBoard";
import Analytics from "./Analytics";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";

interface EventDashboardProps {
  onEventCreate?: (data: any) => void;
  onMilestoneUpdate?: (id: string) => void;
  onTemplateSelect?: (template: any) => void;
  onVendorMessage?: (vendor: any) => void;
  onGuestUpdate?: (id: string, updates: any) => void;
  onTaskUpdate?: (id: string, updates: any) => void;
}

const EventDashboard: React.FC<EventDashboardProps> = ({
  onEventCreate = () => {},
  onMilestoneUpdate = () => {},
  onTemplateSelect = () => {},
  onVendorMessage = () => {},
  onGuestUpdate = () => {},
  onTaskUpdate = () => {},
}) => {
  return (
    <div className="flex h-[922px] w-[1512px] bg-gray-100">
      <div className="flex-1 p-6 overflow-auto">
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="tasks">Tasks</TabsTrigger>
            <TabsTrigger value="guests">Guests</TabsTrigger>
            <TabsTrigger value="vendors">Vendors</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
              {/* Main Content Area */}
              <div className="space-y-6">
                <EventCreationCard onSubmit={onEventCreate} />
                <TimelineDisplay onMilestoneClick={onMilestoneUpdate} />
              </div>

              {/* Right Column */}
              <div className="space-y-6">
                <BudgetTracker />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="tasks">
            <TaskBoard onTaskUpdate={onTaskUpdate} />
          </TabsContent>

          <TabsContent value="guests">
            <GuestList onGuestUpdate={onGuestUpdate} />
          </TabsContent>

          <TabsContent value="vendors">
            <VendorDirectory onMessageVendor={onVendorMessage} />
          </TabsContent>

          <TabsContent value="analytics">
            <Analytics />
          </TabsContent>
        </Tabs>
      </div>

      {/* Template Sidebar */}
      <TemplateSidebar onTemplateSelect={onTemplateSelect} />
    </div>
  );
};

export default EventDashboard;
