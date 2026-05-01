"use client";

import { Button } from "@repo/ui/components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerTrigger,
} from "@repo/ui/components/ui/drawer";
import {
  FilterSidebar,
  type DriverJobsFilters,
} from "../components/driver-jobs/FilterSidebar";
import { JobCard } from "../components/driver-jobs/JobCard";
import { Filter, PlusCircle, Search, X } from "lucide-react";
import React, { useMemo, useState } from "react";
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

const initialFilters: DriverJobsFilters = {
  jobType: [],
  experience: [],
  salary: [],
  location: [],
};

const jobTypeMap: Record<string, string> = {
  "Full Time": "FULL_TIME",
  "Part Time": "PART_TIME",
  Contract: "CONTRACT",
  Temporary: "TEMPORARY",
};

const experienceBandToRange: Record<string, [number, number]> = {
  "Entry Level (0-1 years)": [0, 1],
  "Junior (1-3 years)": [1, 3],
  "Mid-Level (3-5 years)": [3, 5],
  "Senior (5+ years)": [5, Infinity],
};

const salaryBandToRange: Record<string, [number, number]> = {
  "Up to ₹15,000": [0, 15000],
  "₹15,000 - ₹25,000": [15000, 25000],
  "₹25,000 - ₹35,000": [25000, 35000],
  "Above ₹35,000": [35000, Infinity],
};

export default function DriverJobsPage() {
  const router = useRouter();
  const [page] = useState(1);
  const [limit] = useState(10);
  const [search, setSearch] = useState("");
  const { data, isLoading, isError } = useOpenDriverJobs(page, limit, search);

  const [filters, setFilters] = useState<DriverJobsFilters>(initialFilters);
  const [open, setOpen] = useState(false);

  const handleChange = <K extends keyof DriverJobsFilters>(
    key: K,
    value: DriverJobsFilters[K]
  ) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => setFilters(initialFilters);
  const handleApplyFilters = () => setOpen(false);

  const filteredJobs = useMemo(() => {
    const items = data?.items ?? [];

    return items.filter((j) => {
      if (filters.jobType.length > 0) {
        const wantedEnums = filters.jobType
          .map((label) => jobTypeMap[label])
          .filter(Boolean);
        if (!wantedEnums.includes(j.jobType)) return false;
      }

      if (filters.location.length > 0) {
        const matched = filters.location.some(
          (loc) => loc.toLowerCase() === (j.location ?? "").toLowerCase()
        );
        if (!matched) return false;
      }

      if (filters.experience.length > 0) {
        const yrs = j.experience ?? 0;
        const inAnyBand = filters.experience.some((label) => {
          const range = experienceBandToRange[label];
          return range ? yrs >= range[0] && yrs <= range[1] : false;
        });
        if (!inAnyBand) return false;
      }

      if (filters.salary.length > 0) {
        const jobMin = j.minSalary ?? 0;
        const jobMax = j.maxSalary ?? Infinity;
        const overlapsAnyBand = filters.salary.some((label) => {
          const band = salaryBandToRange[label];
          if (!band) return false;
          const [bMin, bMax] = band;
          return jobMax >= bMin && jobMin <= bMax;
        });
        if (!overlapsAnyBand) return false;
      }

      return true;
    });
  }, [data?.items, filters]);

  // Auth functionality for Post a Job button
  const { executeWithAuth, showAuthDialog, handleSignIn, handleRegister, closeDialog } =
    useLazyAuthAction();

  const filterSidebarProps = {
    filters,
    handleChange,
    clearFilters,
    onApply: handleApplyFilters,
  };

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
            onClick={() =>
              executeWithAuth(() => {
                router.push("/driver-jobs/create-job-post");
              })
            }
          >
            <PlusCircle className="mr-2 h-5 w-5" /> Post a Job
          </Button>
        </div>
        <div className="md:hidden space-y-4">
          <div className="text-left mb-4">
            <h1 className="text-2xl font-semibold text-textdark">Browse Jobs</h1>
            <p className="text-textdark/70 text-base">
              Find driving opportunities that match your skills & preferences.
            </p>
          </div>
          <Button
            className="bg-textdark  text-white hover:bg-textdark/80 text-base w-full "
            onClick={() =>
              executeWithAuth(() => {
                router.push("/driver-jobs/create-job-post");
              })
            }
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
            <Drawer open={open} onOpenChange={setOpen}>
              <DrawerTrigger asChild>
                <Button variant="outline" size="icon" className="border-primary/30 shrink-0">
                  <Filter className="h-4 w-4" />
                </Button>
              </DrawerTrigger>
              <DrawerContent className="max-h-[85vh] overflow-hidden">
                <div className="h-full overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                  <div className="p-4 pb-8">
                    <div className="flex items-center justify-between mb-4">
                      <h2 className="text-lg font-semibold text-textdark">Filter Jobs</h2>
                      <DrawerClose asChild>
                        <Button variant="ghost" size="icon" aria-label="Close filters">
                          <X className="h-5 w-5" />
                        </Button>
                      </DrawerClose>
                    </div>
                    <FilterSidebar {...filterSidebarProps} />
                  </div>
                </div>
              </DrawerContent>
            </Drawer>
          </div>
        </div>
      </header>

      <div className="md:flex md:gap-8">
        <aside className="hidden md:block md:w-1/3 lg:w-1/4">
          <FilterSidebar {...filterSidebarProps} />
        </aside>

        <main className="w-full md:w-2/3 lg:w-3/4">
          <div className="space-y-6">
            {isLoading && (
              <div className="text-center text-muted-foreground">Loading jobs...</div>
            )}
            {isError && (
              <div className="text-center text-red-600">Failed to load jobs.</div>
            )}
            {!isLoading && !isError && data?.items?.length === 0 && (
              <div className="text-center text-muted-foreground">No jobs found.</div>
            )}
            {!isLoading &&
              !isError &&
              (data?.items?.length ?? 0) > 0 &&
              filteredJobs.length === 0 && (
                <div className="py-16 text-center text-textdark/70">
                  No jobs match your filters.{" "}
                  <button
                    type="button"
                    onClick={clearFilters}
                    className="text-primary underline"
                  >
                    Clear all filters
                  </button>
                </div>
              )}
            {!isLoading &&
              !isError &&
              filteredJobs.map((j) => {
                const mapped = {
                  id: j.id,
                  title: j.title,
                  company: j.companyName,
                  location: j.location,
                  type: j.jobType,
                  salary: formatSalary(j.minSalary, j.maxSalary),
                  monthlySalary: "",
                  experience:
                    j.experience != null ? `${j.experience} yrs exp` : "",
                  tags: [],
                  description: j.description,
                  benefits: [],
                  additionalInfo: j.requirements ?? "",
                };
                return (
                  <JobCard
                    key={j.id}
                    job={mapped}
                    executeWithAuth={executeWithAuth}
                  />
                );
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

      <AuthDialog
        isOpen={showAuthDialog}
        onClose={closeDialog}
        onSignIn={handleSignIn}
        onRegister={handleRegister}
      />
    </div>
  );
}
