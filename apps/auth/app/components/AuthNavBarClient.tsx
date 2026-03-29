"use client";

import React, { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import Navbar, {
  type NavBarProps,
  type NavLinkItem,
  type ProfileData,
} from "@repo/ui/components/navbar/NavBar";// Adjust path if necessary
import { BottomNavbar, type NavItem } from "@repo/ui/components/navbar/BottomNavbar";
import { Home, ShoppingCart, Briefcase } from "lucide-react";

const AuthNavBarClient = () => {
  const router = useRouter();
  const pathname = usePathname();

  const [activeLinkKey, setActiveLinkKey] = useState<string>("HOME");
  const [isMobile, setIsMobile] = useState(false);

  // Get environment variables (NEXT_PUBLIC_* vars are embedded at build time)
  // Using non-null assertions since these are set at build time in Coolify
  const MARKETPLACE_BASE = process.env.NEXT_PUBLIC_MARKETPLACE_URL!;
  const DRIVERJOBS_BASE = process.env.NEXT_PUBLIC_DRIVERJOBS_BASE_URL!;

  // Define navigation links specific to the auth app (computed at runtime)
  const authNavLinks: NavLinkItem[] = [
    { key: "HOME", label: "Home", href: "/" },
    { key: "BUY_SELL", label: "Buy & Sell", href: `${MARKETPLACE_BASE}/posts` },
    { key: "DRIVER_JOBS", label: "Driver Jobs", href: DRIVERJOBS_BASE },
  ];

  // Bottom navbar items for mobile (computed at runtime)
  const bottomNavItems: NavItem[] = [
    { href: "/", icon: Home, label: "Home" },
    { href: `${MARKETPLACE_BASE}/posts`, icon: ShoppingCart, label: "Buy & Sell" },
    { href: DRIVERJOBS_BASE, icon: Briefcase, label: "Jobs" },
  ];

  // Mobile detection
  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 768); // md breakpoint
    };

    checkIsMobile();
    window.addEventListener('resize', checkIsMobile);

    return () => window.removeEventListener('resize', checkIsMobile);
  }, []);

  useEffect(() => {
    // Determine active link based on pathname
    const currentLink = authNavLinks.find(
      (link) => link.href === pathname
    );
    if (currentLink) {
      setActiveLinkKey(currentLink.key);
    } else if (pathname === "/") {
      setActiveLinkKey("HOME"); // Default to home
    }
  }, [pathname]);

  // Transform userProfile to ProfileData - no profile for auth app
  const navBarProfileData: ProfileData | undefined = undefined;

  const handleLogoClick = () => {
    router.push("/");
  };

  const handleSignInClick = () => {
    router.push("/login");
  };

  const handleRegisterClick = () => {
    router.push("/signup");
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
    router.push("/user-profile");
  }

  const navBarProps: NavBarProps = {
    navLinks: authNavLinks,
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
      {isMobile && <BottomNavbar navItems={bottomNavItems} />}
    </>
  );
};

export default AuthNavBarClient;
