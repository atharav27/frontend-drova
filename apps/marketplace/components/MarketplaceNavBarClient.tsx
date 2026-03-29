"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useRouter, usePathname } from "next/navigation";
import Navbar, {
  type NavBarProps,
  type NavLinkItem,
  type ProfileData,
} from "@repo/ui/components/navbar/NavBar";// Adjust path if necessary
import { BottomNavbar, type NavItem } from "@repo/ui/components/navbar/BottomNavbar";
import { useUserProfile } from "~/hooks/query/useUserProfile";
import { useAuthMe } from "@repo/hooks";
import { Home, ShoppingCart, Briefcase } from "lucide-react";


// Define navigation links specific to the marketplace
const marketplaceNavLinks: NavLinkItem[] = [
  { key: "HOME", label: "Home", href: "/" },
  { key: "BUY_SELL", label: "Buy & Sell", href: "/posts" },
  { key: "DRIVER_JOBS", label: "Driver Jobs", href: `${process.env.NEXT_PUBLIC_DRIVERJOBS_BASE_URL}/driver-jobs` },
];

// Bottom navbar items for mobile
const bottomNavItems: NavItem[] = [
  { href: "/", icon: Home, label: "Home" },
  { href: "/posts", icon: ShoppingCart, label: "Buy & Sell" },
  { href: `${process.env.NEXT_PUBLIC_DRIVERJOBS_BASE_URL}/driver-jobs`, icon: Briefcase, label: "Jobs" },
];


const MarketplaceNavBarClient = () => {
  const router = useRouter();
  const pathname = usePathname();

  const [activeLinkKey, setActiveLinkKey] = useState<string>("HOME");
  const [isMobile, setIsMobile] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false);
  const { status } = useAuthMe();
  const { data: userProfile } = useUserProfile({ enabled: status === 'authenticated' });

  // Hydration detection
  useEffect(() => {
    setIsHydrated(true);
  }, []);

  // Mobile detection - only after hydration
  useEffect(() => {
    if (!isHydrated) return;

    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 768); // md breakpoint
    };

    checkIsMobile();
    window.addEventListener('resize', checkIsMobile);

    return () => window.removeEventListener('resize', checkIsMobile);
  }, [isHydrated]);
  useEffect(() => {
    // Determine active link based on pathname
    const currentLink = marketplaceNavLinks.find(
      (link) => link.href === pathname
    );
    if (currentLink) {
      setActiveLinkKey(currentLink.key);
    } else if (pathname === "/") {
      setActiveLinkKey("HOME"); // Default to home
    }
  }, [pathname]);


  const navBarProfileData: ProfileData | undefined = useMemo(() => {
    if (status !== 'authenticated' || !userProfile) return undefined;
    return { city: userProfile.city } as ProfileData;
  }, [status, userProfile]);

  const handleLogoClick = () => {
    router.push("/");
  };

  const handleSignInClick = () => {
    const authBase = process.env.NEXT_PUBLIC_AUTH_BASE_URL;
    if (!authBase) {
      console.error('NEXT_PUBLIC_AUTH_BASE_URL is not set');
      return;
    }
    window.location.href = `${authBase}/login`;
  };

  const handleRegisterClick = () => {
    const authBase = process.env.NEXT_PUBLIC_AUTH_BASE_URL;
    if (!authBase) {
      console.error('NEXT_PUBLIC_AUTH_BASE_URL is not set');
      return;
    }
    window.location.href = `${authBase}/signup`;
  };

  const handleNavLinkClick = (href: string, key: string) => {
    setActiveLinkKey(key);
    if (href.startsWith("http")) {
      // External link
      window.location.href = href;
    } else {
      router.push(href);
    }
  };

  const handleProfileClick = () => {
    // Profile button is only visible when user has profileData (authenticated)
    // So we can directly navigate without auth check
    router.push("/user-profile");
  };

  const navBarProps: NavBarProps = {
    navLinks: marketplaceNavLinks,
    activeLinkKey,
    onLogoClick: handleLogoClick,
    onSignInClick: handleSignInClick,
    onRegisterClick: handleRegisterClick,
    onNavLinkClick: handleNavLinkClick,
    onProfileClick: handleProfileClick,
    profileData: navBarProfileData, // Pass the transformed data
    isMobile, // Pass mobile state to Navbar
  };

  return (
    <>
      <Navbar {...navBarProps} />
      {isHydrated && isMobile && <BottomNavbar navItems={bottomNavItems} />}
    </>
  );
};

export default MarketplaceNavBarClient;
