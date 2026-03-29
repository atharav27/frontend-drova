"use client";

import { Card } from "@repo/ui/components/ui/card";
import { Button } from "@repo/ui/components/ui/button";
import { Badge } from "@repo/ui/components/ui/badge";
import { ArrowRight, Briefcase, Building2, MapPin, Clock, Route } from "lucide-react";
import React from "react";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@repo/ui/components/ui/table";
import { useRouter } from "next/navigation";

export type MyApplicationRow = {
  id: string | number;
  jobTitle: string;
  company: string;
  location: string;
  appliedOn: string;
  status: string;
  statusColor: string;
  tags: string[];
};

// Card component for mobile/tablet view
function ApplicationCard({ app, onDetailsClick }: { app: MyApplicationRow, onDetailsClick: () => void }) {
  return (
    <Card className="w-full rounded-xl border gap-4 border-gray-200 bg-white p-6 mb-4 ">
      <div className="flex justify-between items-start">
        <h3 className="text-lg font-semibold text-textdark pr-4 leading-tight">
          {app.jobTitle}
        </h3>
        <span className={`px-4 py-1 rounded-full text-xs sm:text-sm font-medium text-white whitespace-nowrap ${app.statusColor}`}>
          {app.status}
        </span>
      </div>

      <div className="text-textdark/70 text-base ">
        {app.appliedOn}
      </div>

      <div className="space-y-2 ">
        <div className="flex items-center gap-2 text-textdark/70">
          <Clock className="h-4 w-4 sm:h-5 sm:w-5" />
          <span className="text-base">{app.tags[0]}</span>
        </div>

        <div className="flex items-center gap-2 text-textdark/70">
          <Building2 className="h-4 w-4 sm:h-5 sm:w-5" />
          <span className="text-base">{app.company}</span>
        </div>

        <div className="flex items-center gap-2 text-textdark/70">
          <MapPin className="h-4 w-4 sm:h-5 sm:w-5" />
          <span className="text-base">{app.location}</span>
        </div>

        <div className="flex items-center gap-2 text-textdark/70">
          <Route  className="h-4 w-4 sm:h-5 sm:w-5" />

          <span className="text-base">  {app.tags[1]}</span>
        </div>
      </div>

      <Button
        variant="outline"
        className="w-full rounded-lg text-primary border-primary flex items-center justify-center gap-2 py-2 text-base font-medium hover:bg-primary/10 hover:text-primary"
        onClick={onDetailsClick}
      >
        Details <ArrowRight className="h-4 w-4" />
      </Button>
    </Card>
  );
}

export function JobApplicationsTable({ applications }: { applications: MyApplicationRow[] }) {
  const router = useRouter();
  const rows = applications;

  const onDetailsClick = () => {
    router.push("/driver-jobs/jobid");
  };

  return (
    <Card className="w-full rounded-xl border border-gray-200 bg-white p-4 md:p-8 lg:p-10 overflow-hidden">
      <div className="p-4 md:p-6 pb-2">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xl md:text-2xl font-semibold text-textdark">All Applications</span>
          <span className="text-primary font-semibold text-xl md:text-2xl">({rows.length})</span>
        </div>
        <div className="text-textdark/70 text-base md:text-lg">View and manage all your job applications.</div>
      </div>

      {/* Mobile/Tablet Card View (less than lg) */}
      <div className="lg:hidden grid grid-cols-1 md:grid-cols-2 gap-4">
        {rows.length === 0 ? (
          <div className="text-center text-textdark/70 py-6">No applications found.</div>
        ) : (
          rows.map((app) => (
            <ApplicationCard key={app.id} app={app} onDetailsClick={onDetailsClick} />
          ))
        )}
      </div>

      {/* Desktop Table View (lg and above) */}
      <div className="hidden lg:block pb-2">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent border-b-0">
              <TableHead className="w-[220px] md:w-[320px] lg:w-[350px] min-w-[180px] md:min-w-[250px] max-w-[350px] text-textdark font-medium text-base md:text-lg">Job Details</TableHead>
              <TableHead className="flex-1 text-textdark font-medium text-base md:text-lg text-center">Applied On</TableHead>
              <TableHead className="flex-1 text-textdark font-medium text-base md:text-lg text-center">Status</TableHead>
              <TableHead className="flex-1 text-textdark font-medium text-base md:text-lg text-center">More</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center text-textdark/70 py-8">No applications found.</TableCell>
              </TableRow>
            ) : (
              rows.map((app) => (
                <TableRow key={app.id} className="border-b-0">
                {/* Job Details */}
                <TableCell className="w-[220px] md:w-[320px] lg:w-[350px] min-w-[180px] md:min-w-[250px] max-w-[350px] align-top space-y-2 md:space-y-3">
                  <div className="font-semibold text-textdark text-lg md:text-xl lg:text-2xl mb-1 truncate break-words">{app.jobTitle}</div>
                  <div className="flex items-center gap-2 text-textdark/70 font-normal text-sm md:text-lg mb-1">
                    <Briefcase className="h-4 w-4 text-textdark/70" /> {app.company}
                  </div>
                  <div className="flex items-center gap-2 text-textdark/70 font-normal text-sm md:text-lg mb-2">
                    <MapPin className="h-4 w-4 text-textdark/70" /> {app.location}
                  </div>
                  <div className="flex gap-2 flex-wrap">
                    {app.tags.map((tag) => (
                      <Badge key={tag} variant="outline" className="text-primary border-primary bg-primary/5 px-2 md:px-3 py-0.5 text-xs md:text-base font-medium rounded-full">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </TableCell>
                {/* Applied On */}
                <TableCell className="flex-1 align-middle text-center text-textdark/70 text-base md:text-xl">{app.appliedOn}</TableCell>
                {/* Status */}
                <TableCell className="flex-1 align-middle text-center">
                  <span className={`px-5 md:px-8 py-1 rounded-3xl text-base md:text-xl font-medium text-white ${app.statusColor}`}>
                    {app.status}
                  </span>
                </TableCell>
                {/* More */}
                <TableCell className="flex-1 align-middle text-center">
                  <Button
                    variant="outline"
                    className="text-primary border-primary w-full md:w-28 flex items-center justify-between md:justify-center px-3 md:px-5 py-2 md:py-4 h-8 md:h-10 text-base md:text-lg font-medium mx-auto hover:bg-primary/10 hover:text-primary"
                    onClick={onDetailsClick}
                  >
                    Details <ArrowRight className="h-4 w-4 ml-1" />
                  </Button>
                </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </Card>
  );
}
