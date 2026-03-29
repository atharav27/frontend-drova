"use client";

import { Button } from "@repo/ui/components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerTrigger,
} from "@repo/ui/components/ui/drawer";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@repo/ui/components/ui/select";
import { Slider } from "@repo/ui/components/ui/slider";
import { Label } from "@repo/ui/components/ui/label";
import React, { useState } from "react";
import { Filter, X } from "lucide-react";

const vehicleTypes = ["Car", "Truck", "Bus", "Two-wheeler"];
const licenseTypes = ["MCWG", "LMV", "HGV", "HPV"];
const experiences = [
  "Entry Level (0-1 years)",
  "Junior (1-3 years)",
  "Mid-Level (3-5 years)",
  "Senior (5+ years)",
];
const locations = ["Bangalore", "Mumbai", "Hyderabad", "Pune", "Delhi"];

const MobileFilterContent = () => {
  const [salaryRange, setSalaryRange] = useState([10000]);
  const [vehicleType, setVehicleType] = useState("");
  const [location, setLocation] = useState("");
  const [licenseType, setLicenseType] = useState("");
  const [experience, setExperience] = useState("");

  const handleReset = () => {
    setSalaryRange([10000]);
    setVehicleType("");
    setLocation("");
    setLicenseType("");
    setExperience("");
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-textdark">Filter Jobs</h2>
        <DrawerClose asChild>
          <Button variant="ghost" size="icon">
            <X className="h-5 w-5" />
          </Button>
        </DrawerClose>
      </div>

      {/* Salary Range */}
      <div className="space-y-3">
        <Label className="text-base font-medium text-textdark">Salary Range (₹)</Label>
        <div className="px-2">
          <Slider
            value={salaryRange}
            onValueChange={setSalaryRange}
            max={50000}
            min={10000}
            step={1000}
            className="w-full"
          />
          <div className="flex justify-between text-sm text-textdark/70 mt-2">
            <span>₹10,000</span>
            <span>₹{(salaryRange[0] || 10000).toLocaleString()}</span>
            <span>₹50,000</span>
          </div>
        </div>
      </div>

      {/* Vehicle Type */}
      <div className="space-y-3">
        <Label className="text-base font-medium text-textdark">Vehicle Type</Label>
        <Select value={vehicleType} onValueChange={setVehicleType}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select Type" />
          </SelectTrigger>
          <SelectContent>
            {vehicleTypes.map((type) => (
              <SelectItem key={type} value={type}>
                {type}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Location */}
      <div className="space-y-3">
        <Label className="text-base font-medium text-textdark">Location</Label>
        <Select value={location} onValueChange={setLocation}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select Location" />
          </SelectTrigger>
          <SelectContent>
            {locations.map((loc) => (
              <SelectItem key={loc} value={loc}>
                {loc}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Type of License */}
      <div className="space-y-3">
        <Label className="text-base font-medium text-textdark">Type of License</Label>
        <Select value={licenseType} onValueChange={setLicenseType}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select Your Type of License" />
          </SelectTrigger>
          <SelectContent>
            {licenseTypes.map((type) => (
              <SelectItem key={type} value={type}>
                {type}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Experience */}
      <div className="space-y-3">
        <Label className="text-base font-medium text-textdark">Experience</Label>
        <Select value={experience} onValueChange={setExperience}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select Year of Experience" />
          </SelectTrigger>
          <SelectContent>
            {experiences.map((exp) => (
              <SelectItem key={exp} value={exp}>
                {exp}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3 pt-4">
        <Button
          variant="outline"
          className="flex-1 py-3 text-base text-textdark border-textdark hover:text-textdark "
          onClick={handleReset}
        >
          Reset
        </Button>
        <Button className="flex-1 py-3 text-base">
          Apply Filters
        </Button>
      </div>
    </div>
  );
};

export function MobileFilterDrawer() {
  return (
    <div className="md:hidden">
      <Drawer>
        <DrawerTrigger asChild>
          <Button variant="outline" size="icon">
            <Filter className="h-4 w-4" />
          </Button>
        </DrawerTrigger>
        <DrawerContent className="max-h-[85vh] overflow-hidden">
          <div className="h-full overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
            <MobileFilterContent />
          </div>
        </DrawerContent>
      </Drawer>
    </div>
  );
}
