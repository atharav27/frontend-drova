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
import React, { useId } from "react";

export type DriverJobsFilters = {
  jobType: string[];
  experience: string[];
  salary: string[];
  location: string[];
};

type FilterSidebarProps = {
  filters: DriverJobsFilters;
  handleChange: <K extends keyof DriverJobsFilters>(
    key: K,
    value: DriverJobsFilters[K]
  ) => void;
  clearFilters: () => void;
  onApply?: () => void;
};

const jobTypes = ["Full Time", "Part Time", "Contract", "Temporary"];
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

function FilterAccordion({
  filters,
  handleChange,
}: Pick<FilterSidebarProps, "filters" | "handleChange">) {
  const baseId = useId();

  const toggle = (
    key: keyof DriverJobsFilters,
    value: string,
    checked: boolean
  ) => {
    const current = filters[key] as string[];
    handleChange(
      key,
      checked ? [...current, value] : current.filter((v) => v !== value)
    );
  };

  return (
    <Accordion
      type="multiple"
      defaultValue={["jobType", "experience", "salary", "location"]}
    >
      <AccordionItem value="jobType">
        <AccordionTrigger className="font-medium text-textdark text-base sm:text-lg hover:no-underline">
          Job Type
        </AccordionTrigger>
        <AccordionContent className="space-y-3 pt-3">
          {jobTypes.map((type, i) => (
            <div key={type} className="flex items-center space-x-2">
              <Checkbox
                id={`${baseId}-job-${i}`}
                className="border-[#BBBEC2] h-6 w-6"
                checked={filters.jobType.includes(type)}
                onCheckedChange={(checked) =>
                  toggle("jobType", type, checked as boolean)
                }
              />
              <Label
                htmlFor={`${baseId}-job-${i}`}
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
          {experiences.map((level, i) => (
            <div key={level} className="flex items-center space-x-2">
              <Checkbox
                id={`${baseId}-exp-${i}`}
                className="border-[#BBBEC2] h-6 w-6"
                checked={filters.experience.includes(level)}
                onCheckedChange={(checked) =>
                  toggle("experience", level, checked as boolean)
                }
              />
              <Label
                htmlFor={`${baseId}-exp-${i}`}
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
          {salaryRanges.map((range, i) => (
            <div key={range} className="flex items-center space-x-2">
              <Checkbox
                id={`${baseId}-salary-${i}`}
                className="border-[#BBBEC2] h-6 w-6"
                checked={filters.salary.includes(range)}
                onCheckedChange={(checked) =>
                  toggle("salary", range, checked as boolean)
                }
              />
              <Label
                htmlFor={`${baseId}-salary-${i}`}
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
          {locations.map((location, i) => (
            <div key={location} className="flex items-center space-x-2">
              <Checkbox
                id={`${baseId}-loc-${i}`}
                className="border-[#BBBEC2] h-6 w-6"
                checked={filters.location.includes(location)}
                onCheckedChange={(checked) =>
                  toggle("location", location, checked as boolean)
                }
              />
              <Label
                htmlFor={`${baseId}-loc-${i}`}
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
}

export function FilterSidebar({
  filters,
  handleChange,
  clearFilters,
  onApply,
}: FilterSidebarProps) {
  return (
    <Card className="border-none py-6 px-4 shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between px-2 md:px-4">
        <CardTitle className="text-lg sm:text-2xl font-semibold text-textdark">
          Filter Jobs
        </CardTitle>
        <Button
          variant="link"
          type="button"
          className="p-0 h-auto text-sm text-textdark"
          onClick={clearFilters}
        >
          Clear All
        </Button>
      </CardHeader>
      <CardContent className="space-y-4 px-2 md:px-4">
        <FilterAccordion filters={filters} handleChange={handleChange} />
        <Button type="button" className="w-full py-4 text-lg" onClick={onApply}>
          Apply
        </Button>
      </CardContent>
    </Card>
  );
}
