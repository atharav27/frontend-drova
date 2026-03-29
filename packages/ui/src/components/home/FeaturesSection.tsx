import { Button } from "@repo/ui/components/ui/button";
import { Card, CardContent } from "@repo/ui/components/ui/card";
import { Briefcase, ShoppingCart, Shield, ArrowRight, LucideIcon } from "lucide-react";

interface FeatureCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  buttonText: string;
  buttonLink: string;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ icon: Icon, title, description, buttonText, buttonLink }) => {
  return (
    <Card className="bg-primary/5 border border-gray-200 w-full">
      <CardContent className="p-6 md:p-8 lg:p-10">
        <div className="flex flex-col items-start space-y-3 md:space-y-4">
          <div className="w-10 h-10 md:w-12 md:h-12 bg-blue-100 rounded-full flex items-center justify-center">
            <Icon className="w-5 h-5 md:w-6 md:h-6 text-primary" />
          </div>
          <h3 className="text-lg md:text-xl font-semibold text-textdark">{title}</h3>
          <p className="text-textdark/70 leading-relaxed text-sm md:text-base">{description}</p>
          <Button
            asChild
            variant="ghost"
            className="text-primary hover:text-primary/90 hover:bg-blue-50 font-medium p-0 h-auto flex items-center gap-1 text-sm md:text-base"
          >
            <a href={buttonLink}>
              {buttonText} <ArrowRight className="w-4 h-4 md:w-5 md:h-5" />
            </a>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

interface FeaturesSectionProps {
  driverJobsUrl: string;
  buySellUrl: string;
  verifyUrl?: string;
}

export default function FeaturesSection({
  driverJobsUrl,
  buySellUrl,
  verifyUrl = "/verify"
}: FeaturesSectionProps) {
  const featuresData: FeatureCardProps[] = [
    {
      icon: Briefcase,
      title: "Driver Jobs",
      description: "Chat with interested buyers and arrange viewings.",
      buttonText: "Browse Jobs",
      buttonLink: driverJobsUrl,
    },
    {
      icon: ShoppingCart,
      title: "Buy & Sell",
      description: "Purchase or sell commercial vehicles and parts through our trusted marketplace.",
      buttonText: "View Marketplace",
      buttonLink: buySellUrl,
    },
    {
      icon: Shield,
      title: "Verified Profiles",
      description: "All users undergo verification based on their role for a safe and trusted community.",
      buttonText: "Get Verified",
      buttonLink: verifyUrl,
    },
  ];
  return (
    <section className="py-12 md:py-16 lg:py-20 bg-white">
      <div className="container lg:px-20">
        {/* Header */}
        <div className="text-center mb-10 md:mb-12 lg:mb-16">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-semibold text-primary mb-3 sm:mb-4">
            Simplifying Logistics Across India
          </h2>
          <p className="text-base sm:text-lg lg:text-xl text-textdark/60 max-w-2xl md:max-w-3xl mx-auto">
            Our platform connects drivers, fleet operators, buyers, and sellers through a
            unified ecosystem.
          </p>
        </div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 xl:gap-14">
          {featuresData.map((feature, index) => (
            <FeatureCard
              key={index}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
              buttonText={feature.buttonText}
              buttonLink={feature.buttonLink}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
