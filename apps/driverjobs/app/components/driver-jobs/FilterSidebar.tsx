"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@repo/ui/components/ui/accordion";
import { Button } from "@repo/ui/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@repo/ui/components/ui/card";
import { Checkbox } from "@repo/ui/components/ui/checkbox";
import { Label } from "@repo/ui/components/ui/label";
import { MobileFilterDrawer } from "./MobileFilterDrawer";
import React from "react";

const jobTypes = ["Full Time", "Part Time", "Contract", "Temporary"];
const vehicleTypes = ["Car", "Truck", "Bus", "Two-wheeler"];
const licenseTypes = ["MCWG", "LMV", "HGV", "HPV"];
const experiences = [
  "Entry Level (0-1 years)",
  "Junior (1-3 years)",
  "Mid-Level (3-5 years)",
  "Senior (5+ years)",
];
const salaryRanges = [
  "Up to ₹15,000",
  "₹15,000 - ₹25,000",
  "₹25,000 - ₹35,000",
  "Above ₹35,000",
];
const locations = ["Bangalore", "Mumbai", "Hyderabad", "Pune", "Delhi"];

const FilterAccordion = () => (
  <Accordion
    type="multiple"
    defaultValue={[
      "jobType",
      "vehicleType",
      "licenseType",
      "experience",
      "salary",
      "location",
    ]}
  >
    <AccordionItem value="jobType" >
      <AccordionTrigger className="font-medium text-textdark text-base sm:text-lg hover:no-underline">
        Job Type
      </AccordionTrigger>
      <AccordionContent className="space-y-3 pt-3">
        {jobTypes.map((type) => (
          <div key={type} className="flex items-center space-x-2">
            <Checkbox
              id={`job-${type}`}
              className="border-[#BBBEC2] h-6 w-6"
            />
            <Label
              htmlFor={`job-${type}`}
              className="font-normal text-textdark/70 text-base sm:text-md md:text-lg"
            >
              {type}
            </Label>
          </div>
        ))}
      </AccordionContent>
    </AccordionItem>
    <AccordionItem value="vehicleType">
      <AccordionTrigger className="font-medium text-textdark text-base sm:text-lg hover:no-underline">
        Vehicle Type
      </AccordionTrigger>
      <AccordionContent className="space-y-3 pt-3">
        {vehicleTypes.map((type) => (
          <div key={type} className="flex items-center space-x-2">
            <Checkbox
              id={`vehicle-${type}`}
              className="border-[#BBBEC2] h-6 w-6"
            />
            <Label
              htmlFor={`vehicle-${type}`}
              className="font-normal text-textdark/70 text-base sm:text-md md:text-lg"
            >
              {type}
            </Label>
          </div>
        ))}
      </AccordionContent>
    </AccordionItem>
    <AccordionItem value="licenseType">
      <AccordionTrigger className="font-medium text-textdark text-base sm:text-lg hover:no-underline">
        Type of License
      </AccordionTrigger>
      <AccordionContent className="space-y-3 pt-3">
        {licenseTypes.map((type) => (
          <div key={type} className="flex items-center space-x-2">
            <Checkbox
              id={`license-${type}`}
              className="border-[#BBBEC2] h-6 w-6"
            />
            <Label
              htmlFor={`license-${type}`}
              className="font-normal text-textdark/70 text-base sm:text-md md:text-lg"
            >
              {type}
            </Label>
          </div>
        ))}
      </AccordionContent>
    </AccordionItem>
    <AccordionItem value="experience">
      <AccordionTrigger className="font-medium text-textdark text-base sm:text-lg hover:no-underline">
        Experience
      </AccordionTrigger>
      <AccordionContent className="space-y-3 pt-3">
        {experiences.map((level) => (
          <div key={level} className="flex items-center space-x-2">
            <Checkbox
              id={`exp-${level}`}
              className="border-[#BBBEC2] h-6 w-6"
            />
            <Label
              htmlFor={`exp-${level}`}
              className="font-normal text-textdark/70 text-base sm:text-md md:text-lg"
            >
              {level}
            </Label>
          </div>
        ))}
      </AccordionContent>
    </AccordionItem>
    <AccordionItem value="salary">
      <AccordionTrigger className="font-medium text-textdark text-base sm:text-lg hover:no-underline">
        Salary Range
      </AccordionTrigger>
      <AccordionContent className="space-y-3 pt-3">
        {salaryRanges.map((range) => (
          <div key={range} className="flex items-center space-x-2">
            <Checkbox
              id={`salary-${range}`}
              className="border-[#BBBEC2] h-6 w-6"
            />
            <Label
              htmlFor={`salary-${range}`}
              className="font-normal text-textdark/70 text-base sm:text-md md:text-lg"
            >
              {range}
            </Label>
          </div>
        ))}
      </AccordionContent>
    </AccordionItem>
    <AccordionItem value="location">
      <AccordionTrigger className="font-medium text-textdark text-base sm:text-lg hover:no-underline">
        Location
      </AccordionTrigger>
      <AccordionContent className="space-y-3 pt-3">
        {locations.map((location) => (
          <div key={location} className="flex items-center space-x-2">
            <Checkbox
              id={`loc-${location}`}
              className="border-[#BBBEC2] h-6 w-6"
            />
            <Label
              htmlFor={`loc-${location}`}
              className="font-normal text-textdark/70 text-base sm:text-md md:text-lg"
            >
              {location}
            </Label>
          </div>
        ))}
      </AccordionContent>
    </AccordionItem>
  </Accordion>
);

export function FilterSidebar() {
  return (
    <>
      {/* Desktop sidebar */}
      <div className="hidden md:block">
        <Card className="border-none py-6 px-4 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between px-2 md:px-4">
            <CardTitle className="text-lg sm:text-2xl font-semibold text-textdark">
              Filter Jobs
            </CardTitle>
            <Button variant="link" className="p-0 h-auto text-sm text-textdark">
              Clear All
            </Button>
          </CardHeader>
          <CardContent className="space-y-4 px-2 md:px-4">
            <FilterAccordion />
            <Button className="w-full py-4 text-lg">Apply</Button>
          </CardContent>
        </Card>
      </div>

      {/* Mobile drawer filter */}
      <MobileFilterDrawer />
    </>
  );
}
