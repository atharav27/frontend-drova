import React from 'react';
import { ArrowRight } from 'lucide-react';

interface StepData {
  number: string;
  title: string;
  description: string;
  hasArrow?: boolean;
}

const stepsContent: StepData[] = [
  {
    number: "01",
    title: "Create Account",
    description: "Register and verify your phone number",
    hasArrow: false,
  },
  {
    number: "02",
    title: "Complete Profile",
    description: "Add role specific details and documents",
    hasArrow: true,
  },
  {
    number: "03",
    title: "Browse listings",
    description: "Explore jobs or marketplace listings",
    hasArrow: true,
  },
  {
    number: "04",
    title: "Connect and apply",
    description: "Contact sellers and apply for jobs",
    hasArrow: true,
  },
];

export default function HowItWorksSection() {
  const sectionTitle = "How It Works";
  const sectionSubtitle = "Simple steps to get started with Drova.";

  return (
    <section className="py-12 md:py-16 bg-white">
      <div className="container  lg:px-24">
        {/* Section Header */}
        <div className="text-center mb-10 md:mb-12 lg:mb-16">
          <h2 className="text-2xl sm:text-3xl font-semibold text-primary mb-2 sm:mb-3">
            {sectionTitle}
          </h2>
          <p className="text-base sm:text-lg text-textdark/60">
            {sectionSubtitle}
          </p>
        </div>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {stepsContent.map((step, index) => (
            <div key={index} className="flex flex-col text-center sm:text-left px-2 sm:px-0">
              <div className="flex items-center justify-center sm:justify-start mb-2">
                {step.hasArrow && (
                  <ArrowRight className="w-5 h-5 sm:w-6 sm:h-6 text-[#B7B9C2] mr-1 sm:mr-2" />
                )}
                <span className={`text-2xl sm:text-3xl font-semibold ${step.hasArrow ? 'text-[#B7B9C2]' : 'text-[#B7B9C2]'}`}>
                  {step.number}
                </span>
              </div>
              <h3 className="text-lg sm:text-xl font-semibold text-textdark mb-1 sm:mb-2">
                {step.title}
              </h3>
              <p className="text-sm sm:text-base text-textdark/70 leading-relaxed">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
