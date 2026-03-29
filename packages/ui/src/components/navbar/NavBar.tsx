"use client";

import { useState } from "react";
import Image from "next/image";
import { Button } from "@repo/ui/components/ui/button";
import { Menu, X, User, UserPlus } from "lucide-react";
import { NavLinks } from "./NavLinks";
import { ProfileButton } from "./ProfileButton";
import logoSrc from "../../../assets/images/drova-logo.png";

export interface NavLinkItem {
  key: string;
  label: string;
  href: string;
  onClick?: (key: string) => void;
}

export interface ProfileData {
  city?: string;
}

export interface NavBarProps {
  navLinks: NavLinkItem[];
  activeLinkKey: string;
  profileData?: ProfileData;
  onLogoClick?: () => void;
  onSignInClick?: () => void;
  onRegisterClick?: () => void;
  onNavLinkClick: (href: string, key: string) => void;
  onProfileClick?: () => void;
  isMobile?: boolean;
}

const Navbar = (props: NavBarProps) => {
  const {
    navLinks,
    activeLinkKey,
    profileData,
    onLogoClick,
    onSignInClick,
    onRegisterClick,
    onNavLinkClick,
    onProfileClick,
    isMobile = false,
  } = props;


  return (
    <>
      <header className="sticky top-0 z-50 bg-white md:py-1 shadow-sm" style={{ fontSize: '16px', fontFamily: 'inherit' }}>
        <div className="px-5 md:container">
          <div className="flex items-center justify-between h-14 sm:h-16">
            {/* Logo and Navigation - Left Side */}
            <div className="flex items-center space-x-12">
              {/* Logo */}
              <div
                onClick={onLogoClick}
                className="flex items-center cursor-pointer"
              >
                <Image src={logoSrc} alt="Drova Logo"  className="h-6 sm:h-7 w-auto" />
              </div>

              {/* Desktop Navigation */}
              <div className="hidden md:flex">
                <NavLinks
                  links={navLinks}
                  activeLinkKey={activeLinkKey}
                  onNavLinkClick={onNavLinkClick}
                />
              </div>
            </div>

            {/* Auth Section - Right */}
            <div className="flex items-center space-x-2 sm:space-x-4">
              {profileData ? (
                <ProfileButton
                  profileData={profileData}
                  onProfileClick={onProfileClick}
                />
              ) : (
                <>
                  <Button
                    variant="outline"
                    onClick={onSignInClick}
                    className="text-primary text-sm sm:text-lg border-primary hover:bg-gray-50 hover:text-primary bg-white font-medium px-2 sm:px-8 md:px-6 lg:px-11 py-0 h-8 sm:h-10 sm:py-3"
                  >
                    Sign In
                  </Button>
                  <Button
                    onClick={onRegisterClick}
                    className="bg-primary hover:bg-primary/90 text-sm sm:text-lg text-white font-medium px-2 sm:px-8 md:px-6 lg:px-11 py-0 h-8 sm:h-10 sm:py-3"
                  >
                    Register
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </header>
    </>
  );
};

export default Navbar;
