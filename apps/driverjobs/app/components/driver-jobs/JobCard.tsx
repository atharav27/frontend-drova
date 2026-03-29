import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@repo/ui/components/ui/card";
import { Badge } from "@repo/ui/components/ui/badge";
import { Button } from "@repo/ui/components/ui/button";
import {
  MapPin,
  Clipboard,
  CircleCheckBig,
  ArrowRight,
  BadgeIndianRupee,
  ChevronDown,
  ChevronUp,
  Bookmark,
} from "lucide-react";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useSaveJobPost, useUnsaveJobPost, useGetJobSavedStatus } from "~/hooks/query/useDriverJobs";
import { toast } from "sonner";

interface JobCardProps {
  job: {
    id: string;
    title: string;
    company: string;
    location: string;
    type: string;
    salary: string;
    experience: string;
    tags: string[];
    description: string;
    monthlySalary: string;
    benefits: string[];
    additionalInfo: string;
  };
  executeWithAuth: (action: () => void) => void;
}

export function JobCard({ job, executeWithAuth }: JobCardProps) {
  const router = useRouter();
  const [isExpanded, setIsExpanded] = useState(false);

  // Save/unsave functionality

  // LOCAL STATE: Track the current save status for immediate UI updates
  const [isSaved, setIsSaved] = useState(false);

  // Hooks for saving and unsaving job post
  const { mutate: saveJob, isPending: isSaving } = useSaveJobPost();
  const { mutate: unsaveJob, isPending: isUnsaving } = useUnsaveJobPost();

  // Hook to get saved status from dedicated API endpoint
  const { data: savedStatusData, isLoading: isLoadingSavedStatus, error: savedStatusError } = useGetJobSavedStatus(job.id, true);

  // SYNC WITH BACKEND: Use dedicated saved status API as the source of truth
  React.useEffect(() => {
    if (savedStatusData?.isSaved !== undefined) {
      setIsSaved(savedStatusData.isSaved);
    }
  }, [savedStatusData]);

  // Handle saved status fetch error
  if (savedStatusError) {
    console.error('Failed to fetch saved status:', savedStatusError);
  }


  const handleSaveToggle = () => {
    executeWithAuth(() => {
      if (!job.id) {
        toast.error("Job ID not available");
        return;
      }

      if (isSaved) {
        // Currently Saved → trigger unsave API, set local state to false
        unsaveJob(job.id, {
          onSuccess: (data) => {
            setIsSaved(false); // Update local state immediately
            toast.success(data.message || "Job removed from your favorites!");
          },
          onError: (error: any) => {
            toast.error(error.message || "Failed to unsave job. Please try again.");
          }
        });
      } else {
        // Currently Not Saved → trigger save API, set local state to true
        saveJob(job.id, {
          onSuccess: (data) => {
            setIsSaved(true); // Update local state immediately
            toast.success(data.message || "Job saved to your favorites!");
          },
          onError: (error: any) => {
            // If it's already saved, show info message
            if (typeof error?.message === 'string' && error.message.toLowerCase().includes('already saved')) {
              setIsSaved(true); // Update local state to match backend
              toast.info("Already saved in your bookmarks");
              return;
            }
            toast.error(error.message || "Failed to save job. Please try again.");
          }
        });
      }
    });
  };

  return (
    <>
      <div className="hidden md:block">
        <Card className="w-full p-4 md:p-8">
          <CardHeader className="p-0 pb-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
              <div>
                <CardTitle className="text-textdark text-lg sm:text-xl font-semibold">
                  {job.title}
                </CardTitle>
                <CardDescription className="text-textdark/80 text-base sm:text-lg">
                  {job.company}
                </CardDescription>
              </div>
              <Badge
                variant="outline"
                className="text-primary text-sm sm:text-md rounded-3xl px-6 py-1 bg-primary/5 border border-primary"
              >
                {job.type}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="p-0 pb-4">
            <div className="flex flex-wrap items-center gap-x-6 gap-y-3 text-sm sm:text-md text-muted-foreground mb-4 py-1">
              <div className="flex items-center">
                <MapPin className="h-4 w-4 mr-1.5" />
                <span>{job.location}</span>
              </div>
              <div className="flex items-center">
                <Clipboard className="h-4 w-4 mr-1.5" />
                <span>LMV License</span>
              </div>
              <div className="flex items-center">
                <CircleCheckBig className="h-4 w-4 mr-1.5" />
                <span>Food & Accommodation Provided</span>
              </div>
            </div>
            <p className="text-sm sm:text-md text-textdark/90">
              {job.description}
            </p>
          </CardContent>
          <CardFooter className="p-0 pt-2 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
            <div className="flex flex-col lg:flex-row items-start lg:items-center gap-x-2">
              <span className="font-bold text-lg sm:text-xl lg:text-2xl text-primary whitespace-nowrap">
                {job.salary}
              </span>
              <div className="">
                <span className="hidden lg:inline text-lg text-primary mx-1">•</span>
                <span className="text-sm sm:text-base lg:text-lg text-primary font-normal">
                  {job.experience}
                </span>
              </div>
            </div>
            <div className="flex flex-row gap-3 w-full lg:w-auto">
              <Button
                variant="outline"
                className="w-full text-primary text-md border border-primary hover:bg-gray-100 hover:text-primary"
                onClick={handleSaveToggle}
                disabled={isSaving || isUnsaving || isLoadingSavedStatus}
              >
                <Bookmark
                  className={`h-4 w-4 mr-2 ${isSaved ? 'fill-primary' : ''}`}
                />
                {isLoadingSavedStatus
                  ? 'Loading...'
                  : isSaving
                    ? 'Saving...'
                    : isUnsaving
                      ? 'Unsaving...'
                      : isSaved
                        ? 'Saved'
                        : 'Save Job'
                }
              </Button>
              <Button
                className="w-full text-white text-md border border-primary"
                onClick={() => executeWithAuth(() => {
                  router.push(`/driver-jobs/job-application-form?jobId=${job.id}`);
                })}
              >
                Apply Now <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </CardFooter>
        </Card>
      </div>

      <div className="block md:hidden">
        <Card className="w-full p-6 space-y-0 gap-2">
          <CardHeader className="p-0 pb-4">
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-textdark text-lg font-semibold">
                  {job.title}
                </CardTitle>
                <CardDescription className="text-textdark/80 text-base">
                  {job.company}
                </CardDescription>
              </div>
              <Badge
                variant="outline"
                className="text-green-700 text-sm rounded-2xl px-3 py-1 bg-green-50 border border-green-200 whitespace-nowrap"
              >
                {job.type}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="p-0 pb-4">
            <div className="space-y-2 text-md text-muted-foreground mb-4">
              <div className="flex items-center">
                <MapPin className="h-4 w-4 mr-2" />
                <span>{job.location}</span>
              </div>
              <div className="flex items-center">
                <BadgeIndianRupee className="h-4 w-4 mr-2" />
                <span>{job.monthlySalary}</span>
              </div>
              <div className="flex items-center">
                <Clipboard className="h-4 w-4 mr-2" />
                <span>LMV License</span>
              </div>
              <div className="flex items-center">
                <CircleCheckBig className="h-4 w-4 mr-2" />
                <span>Food & Accommodation Provided</span>
              </div>
            </div>
            {/* Salary and Experience Row */}
            <div className="flex flex-col items-start gap-1">
              <span className="font-bold text-lg text-primary">
                {job.salary}
              </span>
              <span className="text-sm text-primary font-normal">
                {job.experience}
              </span>
            </div>
          </CardContent>
          <CardFooter className="p-0 pt-2 flex flex-col  gap-3">


            {/* Action Buttons Row - Match Desktop Layout */}
            <div className="flex flex-col sm:flex-row gap-3 w-full">
              <Button
                variant="outline"
                className="flex-1 text-primary text-md border border-primary hover:bg-gray-100 hover:text-primary"
                onClick={handleSaveToggle}
                disabled={isSaving || isUnsaving || isLoadingSavedStatus}
              >
                <Bookmark
                  className={`h-4 w-4 mr-2 ${isSaved ? 'fill-primary' : ''}`}
                />
                {isLoadingSavedStatus
                  ? 'Loading...'
                  : isSaving
                    ? 'Saving...'
                    : isUnsaving
                      ? 'Unsaving...'
                      : isSaved
                        ? 'Saved'
                        : 'Save Job'
                }
              </Button>
              <Button
                className="flex-1 text-white text-md border border-primary"
                onClick={() => executeWithAuth(() => {
                  router.push(`/driver-jobs/job-application-form?jobId=${job.id}`);
                })}
              >
                Apply Now <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                className="flex-1 sm:flex-none sm:w-auto"
                onClick={() => setIsExpanded(!isExpanded)}
              >
                More Details{" "}
                {isExpanded ? (
                  <ChevronUp className="ml-2 h-4 w-4" />
                ) : (
                  <ChevronDown className="ml-2 h-4 w-4" />
                )}
              </Button>
            </div>
          </CardFooter>
          {isExpanded && (
            <div className="pt-4 mt-4 border-t">
              <div>
                <h4 className="font-semibold mb-1">Job Description:</h4>
                <p className="text-sm text-textdark/90">{job.description}</p>
              </div>
              <div className="mt-4">
                <h4 className="font-semibold mb-1">Benefits:</h4>
                <ul className="list-disc list-inside text-sm text-textdark/90">
                  {job.benefits.map((b) => (
                    <li key={b}>{b}</li>
                  ))}
                </ul>
              </div>
              <div className="mt-4">
                <h4 className="font-semibold mb-1">Additional Information:</h4>
                <p className="text-sm text-textdark/90 whitespace-pre-line">
                  {job.additionalInfo}
                </p>
              </div>
            </div>
          )}
        </Card>
      </div>

    </>
  );
}
