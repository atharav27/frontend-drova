"use client";

import { ChevronDown, Globe, MapPin, UserRound } from "lucide-react";
import { ProfileData } from "./NavBar";

export interface ProfileButtonProps {
  profileData: ProfileData;
  onProfileClick?: () => void;
}

export const ProfileButton = ({
  profileData,
  onProfileClick
}: ProfileButtonProps) => {
  return (
    <div className="flex items-center lg:gap-8 gap-4 md:gap-3">
      {/* Language Selector */}
      <div className="hidden sm:flex items-center cursor-pointer">
        <Globe size={22} className="mr-1 text-textdark" />
        <span className="text-md font-medium text-textdark">EN</span>
        <ChevronDown size={18} className="ml-0.5 text-textdark" />
      </div>

      {/* Separator 1 */}
      <div className=" hidden sm:block h-6 w-px bg-[#A1AFC3] self-center"></div>

      {/* Location */}
      {profileData.city && (
        <div className=" hidden sm:flex items-start text-md font-medium text-textdark">
          <MapPin size={22} className="mr-1 text-textdark" />
          <span>{profileData.city}</span>
        </div>
      )}

      {/* Separator 2 (conditional) */}
      {profileData.city && (
        <div className=" hidden sm:block h-6 w-px bg-[#A1AFC3] self-center"></div>
      )}

      {/* Profile Icon */}
      <UserRound
        size={25}
        className="text-textdark cursor-pointer focus:outline-none focus:ring-0 hover:opacity-75 transition-opacity"
        onClick={onProfileClick}
        style={{
          ['--focus-ring' as any]: 'none',
          ['--webkit-focus-ring-color' as any]: 'transparent'
        } as React.CSSProperties}
      />
    </div>
  );
};
