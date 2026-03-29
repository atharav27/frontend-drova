import { Card } from "@repo/ui/components/ui/card";
import React from "react";

export interface JobInfo {
  label: string;
  value: string;
}

export interface JobDetailsCardProps {
  about: string;
  description: string;
  requirements: string[];
  info: JobInfo[];
}

export function JobDetailsCard({
  about,
  description,
  requirements,
  info
}: JobDetailsCardProps) {
  return (
    <Card className="p-6 md:p-14 mt-4 md:mt-6 border-none shadow-sm bg-white">
      <div className="space-y-6 md:space-y-10">
        <h2 className="text-xl md:text-2xl font-semibold text-textdark">Job Details</h2>
        <div>
          <div className="font-semibold text-xl md:text-2xl text-textdark mb-1">About the Company</div>
          <div className="text-textdark/70 text-lg md:text-xl">{about}</div>
        </div>
        <div>
          <div className="font-semibold text-textdark text-xl md:text-2xl mb-1">Job Description</div>
          <div className="text-textdark/70 text-lg md:text-xl">{description}</div>
        </div>
        <div>
          <div className="font-semibold text-textdark text-xl md:text-2xl mb-1">Requirements</div>
          <ul className="list-disc list-inside text-textdark/70 text-lg md:text-xl space-y-1 md:space-y-2">
            {requirements.map((req) => (
              <li key={req}>{req}</li>
            ))}
          </ul>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-10 max-w-3xl mx-10 sm:mx-auto">
          {info.map((item) => (
            <div key={item.label} className="bg-[#F5F5F5] rounded-sm   px-4 md:px-6 py-4 md:py-6 flex flex-col items-center w-full">
              <span className="text-sm md:text-base lg:text-lg text-textdark/60 font-medium mb-1">{item.label}</span>
              <span className="font-semibold text-textdark text-lg md:text-xl lg:text-2xl">{item.value}</span>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
}
