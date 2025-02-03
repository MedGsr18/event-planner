import React from "react";
import { Card, CardContent } from "./ui/card";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { ScrollArea } from "./ui/scroll-area";
import { Badge } from "./ui/badge";
import { Star, MessageCircle, Calendar, ExternalLink } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";

interface Vendor {
  id: string;
  name: string;
  category: string;
  rating: number;
  reviews: number;
  description: string;
  image: string;
  price: string;
}

interface VendorDirectoryProps {
  vendors?: Vendor[];
  onVendorSelect?: (vendor: Vendor) => void;
  onMessageVendor?: (vendor: Vendor) => void;
}

const defaultVendors: Vendor[] = [
  {
    id: "1",
    name: "Elite Catering Co.",
    category: "Catering",
    rating: 4.8,
    reviews: 156,
    description: "Premium catering services for all types of events",
    image: "https://images.unsplash.com/photo-1555244162-803834f70033",
    price: "$$$",
  },
  {
    id: "2",
    name: "Sound & Lights Pro",
    category: "Entertainment",
    rating: 4.9,
    reviews: 89,
    description: "Professional audio-visual equipment and services",
    image: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745",
    price: "$$",
  },
  {
    id: "3",
    name: "Floral Dreams",
    category: "Decoration",
    rating: 4.7,
    reviews: 124,
    description: "Stunning floral arrangements and event decoration",
    image: "https://images.unsplash.com/photo-1507504031003-b417219a0fde",
    price: "$$",
  },
];

const VendorCard = ({
  vendor,
  onMessage,
}: {
  vendor: Vendor;
  onMessage: () => void;
}) => (
  <Card className="mb-4 overflow-hidden hover:shadow-lg transition-shadow">
    <div className="flex">
      <div className="w-32 h-32">
        <img
          src={vendor.image}
          alt={vendor.name}
          className="w-full h-full object-cover"
        />
      </div>
      <CardContent className="flex-1 p-4">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-semibold text-lg">{vendor.name}</h3>
            <Badge variant="secondary" className="mt-1">
              {vendor.category}
            </Badge>
          </div>
          <span className="text-lg font-semibold">{vendor.price}</span>
        </div>

        <p className="text-sm text-muted-foreground mt-2">
          {vendor.description}
        </p>

        <div className="flex justify-between items-center mt-4">
          <div className="flex items-center gap-2">
            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
            <span className="font-medium">{vendor.rating}</span>
            <span className="text-muted-foreground">
              ({vendor.reviews} reviews)
            </span>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={onMessage}>
              <MessageCircle className="w-4 h-4 mr-1" />
              Message
            </Button>
            <Dialog>
              <DialogTrigger asChild>
                <Button size="sm">
                  <Calendar className="w-4 h-4 mr-1" />
                  Check Availability
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Check {vendor.name} Availability</DialogTitle>
                </DialogHeader>
                {/* Add calendar component here */}
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </CardContent>
    </div>
  </Card>
);

const VendorDirectory: React.FC<VendorDirectoryProps> = ({
  vendors = defaultVendors,
  onVendorSelect = () => {},
  onMessageVendor = () => {},
}) => {
  return (
    <Card className="w-full bg-white shadow-lg">
      <div className="p-4 border-b">
        <div className="flex gap-4 mb-4">
          <Input placeholder="Search vendors..." className="flex-1" />
          <Button variant="outline">
            <ExternalLink className="w-4 h-4 mr-1" />
            Filters
          </Button>
        </div>
      </div>
      <ScrollArea className="h-[600px] p-4">
        {vendors.map((vendor) => (
          <VendorCard
            key={vendor.id}
            vendor={vendor}
            onMessage={() => onMessageVendor(vendor)}
          />
        ))}
      </ScrollArea>
    </Card>
  );
};

export default VendorDirectory;
