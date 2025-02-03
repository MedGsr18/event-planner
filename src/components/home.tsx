import React from "react";
import EventDashboard from "./EventDashboard";

interface HomeProps {
  onEventCreate?: (data: any) => void;
  onMilestoneUpdate?: (id: string) => void;
  onTemplateSelect?: (template: any) => void;
}

const Home: React.FC<HomeProps> = ({
  onEventCreate = () => {},
  onMilestoneUpdate = () => {},
  onTemplateSelect = () => {},
}) => {
  return (
    <div className="min-h-screen w-full bg-gray-100 flex justify-center items-center p-4">
      <EventDashboard
        onEventCreate={onEventCreate}
        onMilestoneUpdate={onMilestoneUpdate}
        onTemplateSelect={onTemplateSelect}
      />
    </div>
  );
};

export default Home;
