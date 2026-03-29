// app/(driver)/jobs/page.tsx

import HeroSection from "@repo/ui/components/home/HeroSection";
import FeaturesSection from "@repo/ui/components/home/FeaturesSection";
import FleetCtaSection from "@repo/ui/components/home/FleetCtaSection";
import InsuranceQuoteForm from "@repo/ui/components/home/InsuranceQuoteForm";
import HowItWorksSection from "@repo/ui/components/home/HowItWorksSection";

export default function DriverJobsPage() {
  // Get URLs from environment variables
  // findJobsUrl is local to driverjobs app, buySellUrl points to marketplace app + /posts
  const findJobsUrl = "/driver-jobs";
  const buySellUrl = `${process.env.NEXT_PUBLIC_MARKETPLACE_URL}/posts`;

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <main className="flex-grow">
        <HeroSection
          findJobsUrl={findJobsUrl}
          buySellUrl={buySellUrl}
        />
        <FeaturesSection
          driverJobsUrl={findJobsUrl}
          buySellUrl={buySellUrl}
          verifyUrl="/verify"
        />
        <FleetCtaSection />
        <InsuranceQuoteForm />
        <HowItWorksSection />
      </main>
    </div>
  );
}
