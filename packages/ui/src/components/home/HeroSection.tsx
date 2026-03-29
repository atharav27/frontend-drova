import { Button } from "@repo/ui/components/ui/button";
import Image from "next/image";
import heroImage from "../../../assets/images/hero-section-image.png";

interface HeroSectionProps {
  findJobsUrl?: string;
  buySellUrl?: string;
}

export default function HeroSection({
  findJobsUrl,
  buySellUrl
}: HeroSectionProps) {
  return (
    <div className="container py-8 md:py-12 lg:py-16">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
        {/* Left Content */}
        <div className="space-y-8 md:space-y-12 lg:space-y-16 text-center lg:text-left">
          <div className="space-y-6 md:space-y-8">
            <div className="space-y-2 md:space-y-3">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-semibold">
                <span className="text-[#FFCF51]">Fueling</span>{" "}
                <span className="text-primary ">Ambitions<span className="text-sm text-primary font-bold"> ■</span></span>
              </h1>
              <h2 className="text-4xl sm:text-5xl lg:text-6xl font-semibold text-primary">
                Empowering Drivers<span className="text-sm text-primary font-bold"> ■</span>
              </h2>
            </div>
            <p className="text-textdark/60 text-base sm:text-lg lg:text-xl max-w-md mx-auto lg:mx-0">
              From job opportunities to vehicle deals, everything a
              driver needs, in one powerful platform.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 lg:gap-8 justify-center lg:justify-start">
            <a href={findJobsUrl}>
              <Button
                size="lg"
                className="bg-primary hover:bg-primary/90 text-lg sm:text-xl border border-primary text-white px-6 py-3 sm:px-8 sm:py-4 lg:py-6 rounded-lg font-medium w-full sm:w-auto"
              >
                Find Jobs
              </Button>
            </a>
            <a href={buySellUrl}>
              <Button
                variant="outline"
                size="lg"
                className="border-primary/20 text-primary text-lg sm:text-xl hover:bg-gray-100 hover:text-primary px-6 py-3 sm:px-8 sm:py-4 lg:py-6 rounded-lg font-semibold w-full sm:w-auto"
              >
                Buy & Sell
              </Button>
            </a>
          </div>

          {/* Statistics */}
          <div className="flex  sm:flex-row gap-10 sm:gap-10 lg:gap-8 pt-4 justify-center lg:justify-start">
            <div className="flex   items-center gap-2">
              <div className="text-primary text-4xl sm:text-5xl"> |</div>
              <div className="space-y-1 text-start">
                <div className="text-lg sm:text-xl lg:text-2xl font-semibold text-primary">1000+</div>
                <div className="text-textdark/60 text-base sm:text-lg ">Active Jobs</div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="text-primary text-4xl sm:text-5xl"> |</div>
              <div className="space-y-1 text-start">
                <div className="text-lg sm:text-xl lg:text-2xl font-semibold text-primary">5000+</div>
                <div className="text-textdark/60 text-base sm:text-lg ">Vehicles for Sale</div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Image */}
        <div className="relative mt-8 lg:mt-0">
          <div className="relative overflow-hidden mx-auto max-w-xs sm:max-w-sm md:max-w-md lg:max-w-none">
            <Image
              src={heroImage}
              alt="Happy driver in truck"
              width={600}
              height={380}
              className="w-full h-auto object-cover rounded-lg shadow-xl"
              priority
            />
          </div>
        </div>
      </div>
    </div>
  );
}
