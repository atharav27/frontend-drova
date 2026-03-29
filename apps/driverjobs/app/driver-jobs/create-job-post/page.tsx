"use client";

import { CreateJobForm } from "./CreateJobForm";
import { useRouter } from "next/navigation";
import BackButton from "@repo/ui/components/login/BackButton";
import React from "react";
import AuthGuard from "../../components/AuthGuard";

const listingTips = [
  "Be specific about job requirements and qualifications.",
  "Include accurate salary information to attract qualified candidates.",
  "Provide clear information about working hours and conditions.",
  "Specify license types and categories needed for the role.",
];

export default function CreateJobPostPage() {
  const router = useRouter();

  return (
    <AuthGuard>
      <div className="container py-4 sm:py-6 lg:py-10 ">
        <div className="mb-6 sm:mb-8">
          <BackButton
            isOtpStep={true}
            onBackClick={() => router.back()}
            buttonText="Back"
          />
        </div>

        <div className="mb-6 sm:mb-8">
          <h1 className="text-xl sm:text-2xl font-semibold text-textdark ">Post a New Job</h1>
        </div>
        <div className="max-w-4xl  mx-auto">

          <CreateJobForm />


          <div className="mt-10">
            <h3 className="text-lg md:text-xl font-semibold text-[#3B4973] mb-4">* Listing Tips</h3>
            <ul className="list-disc space-y-2 pl-5 text-base text-[#3B4973]">
              {listingTips.map((tip, index) => (
                <li key={index}>{tip}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </AuthGuard>
  );
}
