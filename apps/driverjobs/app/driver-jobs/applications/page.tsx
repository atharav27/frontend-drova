"use client";
import React, { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import { JobApplicationsTable, MyApplicationRow } from "./JobApplicationsTable";
import BackButton from "@repo/ui/components/login/BackButton";
import AuthGuard from "../../components/AuthGuard";
import { useMyJobApplications } from "~/hooks/query/useDriverJobs";
import { PageLoader } from "@repo/ui/components/common/UnifiedLoader";

export default function MyJobApplicationsPage() {
  const router = useRouter();
  const [page] = useState(1);
  const [limit] = useState(10);
  const { data, isLoading, isError } = useMyJobApplications(page, limit);

  const tableRows: MyApplicationRow[] = useMemo(() => {
    if (!data) return [] as MyApplicationRow[];
    return data.items.map((item) => ({
      id: item.id,
      jobTitle: item.job.title,
      company: item.job.companyName,
      location: item.job.location,
      appliedOn: new Date(item.appliedAt).toLocaleDateString(),
      status: item.status,
      statusColor:
        item.status === "ACCEPTED" ? "bg-[#7DC017]" :
        item.status === "REJECTED" ? "bg-[#DA5959]" :
        item.status === "UNDER_REVIEW" ? "bg-yellow-500" :
        "bg-gray-500",
      tags: [item.job.jobType, `${item.job.location}`],
    }));
  }, [data]);

  return (
    <AuthGuard>
      <div className=" container  py-4 sm:py-6 lg:py-10 ">
        <div className="space-y-10">
          <BackButton
            isOtpStep={true}
            onBackClick={() => router.back()}
            buttonText="Back to Profile Overview"
          />
          <div className="">
            <h1 className="text-3xl font-semibold text-textdark mb-1">My Job Applications</h1>
            <p className="text-textdark/70 text-xl mb-8">Manage and track all your job applications.</p>
          </div>
          {isLoading ? (
            <PageLoader message="Loading applications..." />
          ) : (
            <JobApplicationsTable applications={tableRows} />
          )}
        </div>
      </div>
    </AuthGuard>
  );
}
