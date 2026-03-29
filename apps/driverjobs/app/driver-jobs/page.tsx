"use client";

import { Button } from "@repo/ui/components/ui/button";
import { FilterSidebar } from "../components/driver-jobs/FilterSidebar";
import { JobCard } from "../components/driver-jobs/JobCard";
import { PlusCircle, Search } from "lucide-react";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@repo/ui/components/ui/input";
import { useOpenDriverJobs } from "~/hooks/query";
import { useLazyAuthAction } from "~/hooks/useAuthAction";
import { AuthDialog } from "@repo/ui/components/common/AuthDialog";

// helper to format INR range
const formatSalary = (min?: number | null, max?: number | null) => {
  if (min == null && max == null) return "Salary not disclosed";
  const fmt = (n: number) => new Intl.NumberFormat("en-IN").format(n);
  if (min != null && max != null) return `₹${fmt(min)} - ₹${fmt(max)}`;
  if (min != null) return `From ₹${fmt(min)}`;
  return `Up to ₹${fmt(max as number)}`;
};

export default function DriverJobsPage() {
  const router = useRouter();
  const [page] = useState(1);
  const [limit] = useState(10);
  const [search, setSearch] = useState("");
  const { data, isLoading, isError } = useOpenDriverJobs(page, limit, search);

  // Auth functionality for Post a Job button
  const { executeWithAuth, showAuthDialog, handleSignIn, handleRegister, closeDialog } = useLazyAuthAction();
  return (
    <div className="container mx-auto py-4 sm:py-6 lg:py-10">
      <header className="mb-6 md:mb-8">
        <div className="hidden md:flex flex-col gap-4 sm:flex-row sm:justify-between sm:items-center">
          <div className="text-center sm:text-left">
            <h1 className="text-2xl md:text-3xl font-semibold text-textdark">
              Browse Jobs
            </h1>
            <p className="text-textdark/70 text-base md:text-lg">
              Find driving opportunities that match your skills & preferences.
            </p>
          </div>
          <Button
            className="bg-textdark text-white hover:bg-textdark/80 text-base md:text-lg w-full sm:w-auto"
            onClick={() => executeWithAuth(() => {
              router.push("/driver-jobs/create-job-post");
            })}
          >
            <PlusCircle className="mr-2 h-5 w-5" /> Post a Job
          </Button>
        </div>
        <div className="md:hidden space-y-4">
          <div className="text-left mb-4">
            <h1 className="text-2xl font-semibold text-textdark">
              Browse Jobs
            </h1>
            <p className="text-textdark/70 text-base">
              Find driving opportunities that match your skills & preferences.
            </p>
          </div>
          <Button
            className="bg-textdark  text-white hover:bg-textdark/80 text-base w-full "
            onClick={() => executeWithAuth(() => {
              router.push("/driver-jobs/create-job-post");
            })}
          >
            <PlusCircle className="mr-2 h-5 w-5" /> Post a Job
          </Button>
          <div className="flex items-center gap-2">
            <div className="relative flex-grow">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <Input
                placeholder="Search Jobs..."
                className="pl-10 w-full"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <FilterSidebar />
          </div>
        </div>
      </header>

      <div className="md:flex md:gap-8">
        <aside className="hidden md:block md:w-1/3  lg:w-1/4">
          <FilterSidebar />
        </aside>

        <main className="w-full md:w-2/3 lg:w-3/4">
          <div className="space-y-6">
            {isLoading && <div className="text-center text-muted-foreground">Loading jobs...</div>}
            {isError && <div className="text-center text-red-600">Failed to load jobs.</div>}
            {!isLoading && !isError && data?.items?.length === 0 && (
              <div className="text-center text-muted-foreground">No jobs found.</div>
            )}
            {!isLoading && !isError && data?.items?.map((j) => {
              const mapped = {
                id: j.id,
                title: j.title,
                company: j.companyName,
                location: j.location,
                type: j.jobType,
                salary: formatSalary(j.minSalary, j.maxSalary),
                monthlySalary: "", // not available in API
                experience: j.experience != null ? `${j.experience} yrs exp` : "",
                tags: [],
                description: j.description,
                benefits: [],
                additionalInfo: j.requirements ?? "",
              };
              return <JobCard key={j.id} job={mapped} executeWithAuth={executeWithAuth} />;
            })}
          </div>
          <div className="text-center mt-8">
            <Button
              variant="outline"
              className="text-primary border border-primary hover:bg-primary/10 hover:text-primary px-8 py-6 text-lg"
            >
              Load More Jobs
            </Button>
          </div>
        </main>
      </div>

      {/* Auth Dialog */}
      <AuthDialog
        isOpen={showAuthDialog}
        onClose={closeDialog}
        onSignIn={handleSignIn}
        onRegister={handleRegister}
      />
    </div>
  );
}
