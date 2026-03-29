"use client";

import { JobApplicationForm } from "~/app/driver-jobs/job-application-form/JobApplicationForm";
import { ApplicationSubmitted } from "@repo/ui/components/common/ApplicationSubmitted";
import { useRouter } from "next/navigation";
import BackButton from "@repo/ui/components/login/BackButton";
import Link from "next/link";
import React, { useState, Suspense } from "react";
import AuthGuard from "../../components/AuthGuard";
import { useUserProfile } from "@repo/hooks";
import { PageLoader } from "@repo/ui/components/common/UnifiedLoader";
import { useSearchParams } from "next/navigation";

export default function JobApplicationPage() {
  return (
    <Suspense fallback={<PageLoader message="Loading application form..." /> }>
      <JobApplicationPageInner />
    </Suspense>
  );
}

function JobApplicationPageInner() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();

  const jobId = searchParams.get('jobId');

  const { data: userProfile, isLoading, error } = useUserProfile();

  if (isLoading) {
    return (
      <AuthGuard>
        <PageLoader message="Loading application form..." />
      </AuthGuard>
    );
  }

  if (error) {
    return (
      <AuthGuard>
        <div className="container mx-auto py-8 text-center">
          <h2 className="text-2xl font-semibold text-red-600 mb-4">Error Loading Profile</h2>
          <p className="text-gray-600 mb-4">Unable to load your profile data. Please try again.</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-primary text-white px-4 py-2 rounded hover:bg-primary/80"
          >
            Retry
          </button>
        </div>
      </AuthGuard>
    );
  }

  if (!jobId) {
    return (
      <AuthGuard>
        <div className="container mx-auto py-8 text-center">
          <h2 className="text-2xl font-semibold text-red-600 mb-4">Job ID Required</h2>
          <p className="text-gray-600 mb-4">No job ID found in the URL. Please access this page from a job listing.</p>
          <button
            onClick={() => router.push('/driver-jobs')}
            className="bg-primary text-white px-4 py-2 rounded hover:bg-primary/80"
          >
            Browse Jobs
          </button>
        </div>
      </AuthGuard>
    );
  }

  return (
    <AuthGuard>
      <div>
        <header className="bg-primary text-primary-foreground py-4 sm:py-6 lg:py-10">
          <div className="container mx-auto">
            <div className="flex justify-between items-center">
              <BackButton
                isOtpStep={true}
                onBackClick={() => router.back()}
                buttonText="Back"
                className="text-white flex items-center gap-1"
              />
              <Link
                href="/driver-jobs"
                className="text-sm sm:text-base hover:underline"
              >
                View Other Openings
              </Link>
            </div>
            <div className="mt-6 text-center sm:text-left">
              <h1 className="text-2xl sm:text-4xl font-semibold">
                Delivery Driver - Fastrack Logistics
              </h1>
              <p className="text-lg sm:text-2xl text-primary-foreground/80 mt-1 font-medium">
                Bangalore • LMV License
              </p>
            </div>
          </div>
        </header>

        <main className="py-6 sm:py-10">
          <div className="container mx-auto max-w-5xl px-4">
            <div className=" p-3 sm:p-8">
              {isSubmitted ? (
                <ApplicationSubmitted />
              ) : (
                <>
                  <JobApplicationForm
                    jobId={jobId}
                    userProfile={userProfile}
                    onSubmit={() => setIsSubmitted(true)}
                  />

                  <div className="mt-10 sm:mt-14 text-muted-foreground">
                    <h4 className="font-medium text-base sm:text-lg mb-2 text-[#3B4973]">
                      * Important Information
                    </h4>
                    <p className="text-sm sm:text-base text-[#3B4973]">
                      Your application will be sent to Fastrack Logistics Ltd. They
                      will contact you directly if your profile matches their
                      requirements. By applying, you consent to share your verified
                      details with the company.
                    </p>
                  </div>
                </>
              )}
            </div>
          </div>
        </main>
      </div>
    </AuthGuard>
  );
}
