import HeroSection from "@repo/ui/components/home/HeroSection";
import FeaturesSection from "@repo/ui/components/home/FeaturesSection";
import FleetCtaSection from "@repo/ui/components/home/FleetCtaSection";
import InsuranceQuoteForm from "@repo/ui/components/home/InsuranceQuoteForm";
import HowItWorksSection from "@repo/ui/components/home/HowItWorksSection";

export default function MarketPlacePage() {
  // Get URLs from environment variables
  // findJobsUrl points to driverjobs app, buySellUrl is local to marketplace app
  const findJobsUrl = `${process.env.NEXT_PUBLIC_DRIVERJOBS_BASE_URL}/driver-jobs`;
  const buySellUrl = "/posts";

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
