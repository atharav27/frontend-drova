import React from 'react';
import Image from 'next/image';
import { Button } from '@repo/ui/components/ui/button';
// Assuming the image is correctly located relative to this UI package component
// This path will likely need adjustment based on monorepo structure and build process for assets.
// A common pattern is to place shared assets in the UI package itself or use absolute paths if configured.
import fleetOperatorImage from '../../../assets/images/fleet-operator-checking.png';

export default function FleetCtaSection() {
  // Hardcoded data
  const title = "Looking For Multiple Drivers?";
  const description1 = "Register as a fleet operator and post job listings to find a qualified drivers quickly.";
  const description2 = "Verify your business once and reach thousands of drivers";
  const buttonText = "Register as Fleet Owner";
  const buttonLink = "/register-fleet"; // Example link

  return (
    <section className="bg-[#3B4973] text-white py-12 md:py-16 lg:py-20">
      <div className="container">
        <div className="flex flex-col md:flex-row  justify-between  gap-8 md:gap-12 items-center">
          {/* Left Content Area */}
          <div className="space-y-5 md:space-y-6 text-center md:text-left">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-semibold">
              {title}
            </h2>
            <div className="space-y-2">
              <p className="text-slate-200 text-base sm:text-lg">
                {description1}
              </p>
              <p className="text-slate-200 text-base sm:text-lg">
                {description2}
              </p>
            </div>
            <div className="pt-2 md:pt-4">
              <Button
                asChild
                size="lg"
                className="bg-white text-primary text-base sm:text-lg hover:bg-slate-200 px-6 py-3 sm:px-8 rounded-lg font-semibold shadow-md hover:shadow-lg transition-transform duration-150 ease-in-out hover:scale-105 w-full sm:w-auto"
              >
                <a href={buttonLink}>{buttonText}</a>
              </Button>
            </div>
          </div>

          {/* Right Image Area */}
          <div className="mt-8 md:mt-0 flex justify-center">
            <div className="relative w-full max-w-xs sm:max-w-sm md:max-w-full">
              <Image
                src={fleetOperatorImage}
                alt="Fleet representation"
                width={450}
                height={316}
                className="rounded-lg object-contain mx-auto md:mx-0"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
