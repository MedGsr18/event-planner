import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { ScrollArea } from "./ui/scroll-area";
import { Badge } from "./ui/badge";
import { Checkbox } from "./ui/checkbox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { UserPlus, Mail, Download, Upload, Users } from "lucide-react";

interface Guest {
  id: string;
  name: string;
  email: string;
  category: string;
  rsvpStatus: "pending" | "confirmed" | "declined";
  tableNumber?: number;
}

interface GuestListProps {
  guests?: Guest[];
  onGuestAdd?: (guest: Partial<Guest>) => void;
  onGuestUpdate?: (id: string, updates: Partial<Guest>) => void;
}

const defaultGuests: Guest[] = [
  {
    id: "1",
    name: "John Smith",
    email: "john@example.com",
    category: "Family",
    rsvpStatus: "confirmed",
    tableNumber: 1,
  },
  {
    id: "2",
    name: "Emma Wilson",
    email: "emma@example.com",
    category: "Friends",
    rsvpStatus: "pending",
  },
  {
    id: "3",
    name: "Michael Brown",
    email: "michael@example.com",
    category: "Colleagues",
    rsvpStatus: "declined",
  },
];

const GuestCard = ({ guest }: { guest: Guest }) => (
  <div className="flex items-center space-x-4 p-4 hover:bg-gray-50 rounded-lg">
    <Checkbox id={`guest-${guest.id}`} />
    <div className="flex-1 min-w-0">
      <p className="text-sm font-medium truncate">{guest.name}</p>
      <p className="text-sm text-gray-500 truncate">{guest.email}</p>
    </div>
    <Badge
      variant={
        guest.rsvpStatus === "confirmed"
          ? "default"
          : guest.rsvpStatus === "declined"
            ? "destructive"
            : "secondary"
      }
    >
      {guest.rsvpStatus.charAt(0).toUpperCase() + guest.rsvpStatus.slice(1)}
    </Badge>
    {guest.tableNumber && (
      <Badge variant="outline">Table {guest.tableNumber}</Badge>
    )}
  </div>
);

const GuestList: React.FC<GuestListProps> = ({
  guests = defaultGuests,
  onGuestAdd = () => {},
  onGuestUpdate = () => {},
}) => {
  return (
    <Card className="w-full bg-white shadow-lg">
      <CardHeader className="space-y-4">
        <div className="flex justify-between items-center">
          <CardTitle className="text-2xl font-semibold flex items-center gap-2">
            <Users className="h-6 w-6" />
            Guest List
          </CardTitle>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <Upload className="h-4 w-4 mr-1" />
              Import
            </Button>
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-1" />
              Export
            </Button>
            <Button size="sm">
              <UserPlus className="h-4 w-4 mr-1" />
              Add Guest
            </Button>
          </div>
        </div>
        <div className="flex gap-4">
          <Input placeholder="Search guests..." className="max-w-sm" />
          <Button variant="outline">
            <Mail className="h-4 w-4 mr-1" />
            Send Reminders
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="all" className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="all">All Guests</TabsTrigger>
            <TabsTrigger value="confirmed">Confirmed</TabsTrigger>
            <TabsTrigger value="pending">Pending</TabsTrigger>
            <TabsTrigger value="declined">Declined</TabsTrigger>
          </TabsList>

          <TabsContent value="all">
            <ScrollArea className="h-[400px]">
              <div className="space-y-1">
                {guests.map((guest) => (
                  <GuestCard key={guest.id} guest={guest} />
                ))}
              </div>
            </ScrollArea>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default GuestList;
