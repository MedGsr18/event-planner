import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Progress } from "./ui/progress";
import { ScrollArea } from "./ui/scroll-area";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import {
  BarChart,
  PieChart,
  TrendingUp,
  Download,
  Star,
  Users,
  DollarSign,
} from "lucide-react";

interface AnalyticsProps {
  eventData?: {
    attendees: {
      total: number;
      attended: number;
      satisfaction: number;
    };
    budget: {
      total: number;
      spent: number;
      categories: Array<{ name: string; amount: number; color: string }>;
    };
    vendors: Array<{
      name: string;
      rating: number;
      performance: number;
    }>;
  };
}

const defaultEventData = {
  attendees: {
    total: 150,
    attended: 142,
    satisfaction: 4.8,
  },
  budget: {
    total: 15000,
    spent: 14200,
    categories: [
      { name: "Venue", amount: 5000, color: "bg-blue-500" },
      { name: "Catering", amount: 4000, color: "bg-green-500" },
      { name: "Decoration", amount: 3000, color: "bg-purple-500" },
      { name: "Entertainment", amount: 2200, color: "bg-yellow-500" },
    ],
  },
  vendors: [
    { name: "Elite Catering", rating: 4.9, performance: 95 },
    { name: "Sound & Lights Pro", rating: 4.7, performance: 92 },
    { name: "Floral Dreams", rating: 4.8, performance: 94 },
  ],
};

const StatCard = ({
  title,
  value,
  icon: Icon,
  subtext,
}: {
  title: string;
  value: string;
  icon: any;
  subtext?: string;
}) => (
  <Card>
    <CardContent className="p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <h3 className="text-2xl font-bold mt-2">{value}</h3>
          {subtext && (
            <p className="text-sm text-muted-foreground mt-1">{subtext}</p>
          )}
        </div>
        <div className="p-3 bg-primary/10 rounded-full">
          <Icon className="h-5 w-5 text-primary" />
        </div>
      </div>
    </CardContent>
  </Card>
);

const VendorPerformance = ({
  vendor,
}: {
  vendor: { name: string; rating: number; performance: number };
}) => (
  <div className="flex items-center justify-between p-4 hover:bg-gray-50 rounded-lg">
    <div>
      <h4 className="font-medium">{vendor.name}</h4>
      <div className="flex items-center gap-2 mt-1">
        <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
        <span className="text-sm">{vendor.rating}</span>
      </div>
    </div>
    <div className="text-right">
      <div className="font-medium">{vendor.performance}%</div>
      <div className="text-sm text-muted-foreground">Performance</div>
    </div>
  </div>
);

const Analytics: React.FC<AnalyticsProps> = ({
  eventData = defaultEventData,
}) => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">Event Analytics</h2>
        <Button variant="outline">
          <Download className="h-4 w-4 mr-2" />
          Export Report
        </Button>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <StatCard
          title="Total Attendees"
          value={`${eventData.attendees.attended}/${eventData.attendees.total}`}
          icon={Users}
          subtext={`${Math.round((eventData.attendees.attended / eventData.attendees.total) * 100)}% attendance rate`}
        />
        <StatCard
          title="Satisfaction Score"
          value={eventData.attendees.satisfaction.toFixed(1)}
          icon={Star}
          subtext="Out of 5.0"
        />
        <StatCard
          title="Budget Utilization"
          value={`${Math.round((eventData.budget.spent / eventData.budget.total) * 100)}%`}
          icon={DollarSign}
          subtext={`$${eventData.budget.spent.toLocaleString()} of $${eventData.budget.total.toLocaleString()}`}
        />
      </div>

      <div className="grid grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart className="h-5 w-5" />
              Budget Breakdown
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {eventData.budget.categories.map((category, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>{category.name}</span>
                    <span className="font-medium">
                      ${category.amount.toLocaleString()}
                    </span>
                  </div>
                  <Progress
                    value={(category.amount / eventData.budget.total) * 100}
                    className={`h-2 ${category.color}`}
                  />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Vendor Performance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[200px]">
              <div className="space-y-2">
                {eventData.vendors.map((vendor, index) => (
                  <VendorPerformance key={index} vendor={vendor} />
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Analytics;
