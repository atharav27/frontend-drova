"use client";
import React from "react";
import { useParams, useRouter } from "next/navigation";
import {  Briefcase,  MapPin } from "lucide-react";
import BackButton from "@repo/ui/components/login/BackButton";
import { ApplicationTimeline } from "./ApplicationTimeline";
import { JobDetailsCard } from "./JobDetailsCard";
import AuthGuard from "../../components/AuthGuard";

const mockApplication = {
  id: 1,
  jobTitle: "Truck Driver – Mumbai to Delhi",
  company: "Express Logistics",
  location: "Mumbai, Maharashtra",
  status: "Accepted",
  statusColor: "bg-[#7DC017]",
  about: "Leading logistics provider with over 15 years of experience in transportation and supply chain management.",
  description:
    "We are looking for an experienced truck driver to transport goods from Mumbai to Delhi. The job involves driving a heavy commercial vehicle, ensuring timely delivery, and maintaining proper documentation.",
  requirements: [
    "Valid commercial driving license",
    "Minimum 2 years of experience",
    "Knowledge of transportation regulations",
    "Clean driving record",
  ],
  info: [
    { label: "Job Type", value: "Fulltime" },
    { label: "Distance", value: "1400 Km" },
    { label: "Destination", value: "Delhi" },
    { label: "Payment", value: "₹25,000" },
  ],
  timeline: [
    {
      title: "Application Submitted",
      date: "10 May 2025",
      description: "Your application was received.",
    },
    {
      title: "Under Review",
      date: "11 May 2025",
      description: "Your application is being reviewed by the hiring team.",
    },
    {
      title: "Accepted",
      date: "12 May 2025",
      description: "Your application has been accepted. You'll receive a call from our team shortly.",
    },
  ],
};

export default function JobApplicationDetailsPage() {
  // In real app, fetch data using jobid from params
  // const params = useParams();
  // const jobid = params.jobid;
  // Fetch application details using jobid

  const router = useRouter();
  const app = mockApplication;

  const handleWithdrawApplication = () => {
    // Handle withdraw logic
    console.log("Withdraw application");
  };

  const handleContactEmployer = () => {
    // Handle contact employer logic
    console.log("Contact employer");
  };

  return (
    <AuthGuard>
      <div className="container py-4 sm:py-6 lg:py-10 space-y-8 md:space-y-10">
            <BackButton
        isOtpStep={true}
        onBackClick={() => router.back()}
        buttonText="Back to Applications"
      />
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-2">
        <div>
          <h1 className="text-2xl md:text-3xl font-semibold text-textdark mb-1">{app.jobTitle}</h1>
          <div className="flex flex-col gap-1 mt-2 md:mt-4 text-textdark/70 text-lg md:text-xl">
            <div className="flex items-center gap-2"><Briefcase className="h-4 md:h-5 w-4 md:w-5 text-textdark/70" /> {app.company}</div>
            <div className="flex items-center gap-2"><MapPin className="h-4 md:h-5 w-4 md:w-5 text-textdark/70" /> {app.location}</div>
          </div>
        </div>
        <div className={`px-4 md:px-6 py-1 w-fit rounded-full text-base md:text-lg font-semibold text-white ${app.statusColor}`}>{app.status}</div>
      </div>
      <div className="space-y-8">
        {/* Job Details Card */}
        <JobDetailsCard
          about={app.about}
          description={app.description}
          requirements={app.requirements}
          info={app.info}
        />

        {/* Application Timeline */}
        <ApplicationTimeline
          timeline={app.timeline}
          currentStepIndex={2} // Current step is "Accepted" (index 2)
          onWithdraw={handleWithdrawApplication}
          onContactEmployer={handleContactEmployer}
        />
      </div>
    </div>
    </AuthGuard>
  );
}
