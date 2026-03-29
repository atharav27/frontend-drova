"use client";

import { Card } from "@repo/ui/components/ui/card";
import { Button } from "@repo/ui/components/ui/button";
import React from "react";

export interface TimelineStep {
  title: string;
  date: string;
  description: string;
}

export interface ApplicationTimelineProps {
  timeline: TimelineStep[];
  currentStepIndex?: number;
  onWithdraw?: () => void;
  onContactEmployer?: () => void;
  showActions?: boolean;
}

interface TimelineProgressBarProps {
  timeline: TimelineStep[];
  currentStepIndex: number;
}

function TimelineProgressBar({ timeline, currentStepIndex }: TimelineProgressBarProps) {
  return (
    <div className="relative ml-4 md:ml-6">
      {timeline.map((step, index) => (
        <div key={step.title} className="flex items-start pb-4 sm:pb-6 md:pb-8 last:mb-4 relative">
          {/* Timeline dot */}
          <div className="absolute -left-4 md:-left-6 top-1">
            <div
              className={`w-4 md:w-5 h-4 md:h-5 rounded-full border-2 transition-colors duration-300 ${
                index <= currentStepIndex
                  ? 'bg-primary border-primary'
                  : 'bg-white border-gray-300'
              }`}
            />
          </div>
          {/* Timeline line */}
          {index < timeline.length - 1 && (
            <div className="absolute -left-2.5 md:-left-4 top-6 md:top-8 w-0.5 h-20 bg-gray-200">
              {/* Progress fill for the line */}
              {index < currentStepIndex && (
                <div className="w-full bg-primary transition-all duration-500 ease-in-out h-full" />
              )}
              {index === currentStepIndex && (
                <div
                  className="w-full bg-primary transition-all duration-500 ease-in-out"
                  style={{ height: '50%' }}
                />
              )}
            </div>
          )}
          <div className="ml-6 md:ml-8">
            <div
              className={`font-semibold text-lg md:text-2xl mb-1 transition-colors duration-300 ${
                index <= currentStepIndex ? 'text-textdark' : 'text-textdark/40'
              }`}
            >
              {step.title}
            </div>
            <div
              className={`text-base md:text-xl mb-2 font-medium transition-colors duration-300 ${
                index <= currentStepIndex ? 'text-textdark/60' : 'text-textdark/40'
              }`}
            >
              {step.date}
            </div>
            <div
              className={`text-base md:text-xl font-medium leading-relaxed transition-colors duration-300 ${
                index <= currentStepIndex ? 'text-textdark/70' : 'text-textdark/40'
              }`}
            >
              {step.description}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export function ApplicationTimeline({
  timeline,
  currentStepIndex = timeline.length - 1,
  onWithdraw,
  onContactEmployer,
  showActions = true
}: ApplicationTimelineProps) {
  return (
    <Card className="p-6 md:p-14 mt-6 md:mt-8 bg-white border border-gray-200 shadow-sm">
      <h2 className="text-xl md:text-2xl font-semibold mb-6 md:mb-8 text-textdark">Application Timeline</h2>

      {/* Timeline with Progress */}
      <TimelineProgressBar timeline={timeline} currentStepIndex={currentStepIndex} />
      {showActions && (
        <div className="flex flex-col sm:flex-row sm:justify-center gap-4 md:gap-8">
          <Button
            variant="outline"
            className="border-primary text-primary font-medium text-base md:text-lg py-3 md:py-5 px-6 md:px-10 bg-white hover:text-primary/80 hover:bg-white"
            onClick={onWithdraw}
          >
            Withdraw Application
          </Button>
          <Button
            className="bg-primary text-white font-medium text-base md:text-lg py-3 md:py-5 px-8 md:px-12 border-primary border hover:bg-primary/90"
            onClick={onContactEmployer}
          >
            Contact Employer
          </Button>
        </div>
      )}
    </Card>
  );
}
