"use client"

import { Tabs, TabsList, TabsTrigger, TabsContent } from '@repo/ui/components/ui/tabs';
import { CircleCheckBig } from 'lucide-react';

interface PostDetailsTabsProps {
  post: {
    vehicleName: string;
    vehicleCategory: string;
    yearOfManufacture: number;
    location: string;
    kmsDriven: number;
    fuelType: string;
    transmission: string;
    mileage: number;
    seatingCapacity: number;
    engineDisplacement: number;
    maxPower: number;
    features: string[];
    description?: string;
  };
  getOrdinal: (value: number) => string;
}

export function PostDetailsTabs({ post, getOrdinal }: PostDetailsTabsProps) {
  // Left column specifications
  const leftColumnSpecs = [
    { label: "Vehicle Name", value: post.vehicleName },
    { label: "Vehicle Category", value: post.vehicleCategory },
    { label: "Transmission Type", value: post.transmission },
    { label: "Engine Displacement", value: `${post.engineDisplacement} cc` },
    { label: "Mileage", value: `${post.mileage} km/l` },
  ];

  // Right column specifications
  const rightColumnSpecs = [
    { label: "Year of Manufacture", value: post.yearOfManufacture },
    { label: "Kilometers Driven", value: `${post.kmsDriven.toLocaleString()} km` },
    { label: "Seating Capacity", value: post.seatingCapacity },
    { label: "Max Power", value: `${post.maxPower} HP` },
    { label: "Fuel Type", value: post.fuelType },
  ];

  // Use actual features from post data, fallback to default if empty
  const features = post.features && post.features.length > 0
    ? post.features
    : [
        "Power Steering",
        "AC",
        "Power Windows",
        "Central Locking",
        "Airbags",
        "ABS",
        "Reverse Camera",
        "Bluetooth"
      ];

  return (
    <div className="rounded-lg overflow-hidden">
      <Tabs defaultValue="specifications" className="w-full">
        <div className="pt-2 sm:pt-4 pb-2">
          <TabsList className="h-auto p-1 rounded-md bg-primary/10 shadow-sm border-0 w-auto gap-2 sm:gap-3 items-center">
            <TabsTrigger
              value="specifications"
              className="px-2 sm:px-3 py-1.5 sm:py-2 text-sm sm:text-base rounded-none text-textdark font-semibold data-[state=active]:bg-[#FFFFFF] data-[state=active]:text-textdark data-[state=active]:rounded-md data-[state=inactive]:text-textdark/50"
            >
              Specifications
            </TabsTrigger>
            <TabsTrigger
              value="features"
              className="px-3 sm:px-5 py-1.5 sm:py-2 rounded-none text-sm sm:text-base text-textdark/50 font-semibold data-[state=active]:bg-[#FFFFFF] data-[state=active]:text-textdark data-[state=active]:rounded-md data-[state=inactive]:text-textdark/50"
            >
              Features
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="specifications" className="p-0 mt-0">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-8 lg:gap-20 w-full lg:w-[80%]">
            {/* Left Column */}
            <div className="">
              {leftColumnSpecs.map((spec, index) => (
                <div key={index} className="flex justify-between items-center border-b border-gray-200 pb-2 sm:pb-3 pt-3 sm:pt-4 lg:pt-6 px-2 sm:px-0">
                  <span className="text-textdark/70 font-normal text-base sm:text-lg lg:text-xl w-1/2">{spec.label}</span>
                  <span className="text-textdark font-normal text-base sm:text-lg lg:text-xl w-1/2">{spec.value}</span>
                </div>
              ))}
            </div>

            {/* Right Column */}
            <div className="">
              {rightColumnSpecs.map((spec, index) => (
                <div key={index} className="flex justify-between items-center border-b border-gray-200 pb-2 sm:pb-3 pt-3 sm:pt-4 lg:pt-6 px-2 sm:px-0">
                  <span className="text-textdark/70 font-normal text-base sm:text-lg lg:text-xl w-1/2">{spec.label}</span>
                  <span className="text-textdark font-normal text-base sm:text-lg lg:text-xl w-1/2">{spec.value}</span>
                </div>
              ))}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="features" className="p-3 sm:p-4 lg:p-6 mt-0 w-full sm:w-[90%] lg:w-[75%]">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-6">
            {features.map((feature, index) => (
              <div key={index} className="flex items-start gap-2">
                <CircleCheckBig className="w-4 h-4 sm:w-5 mt-1 sm:h-5 text-primary flex-shrink-0" />
                <span className="text-primary text-base sm:text-lg lg:text-xl font-normal">{feature}</span>
              </div>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
