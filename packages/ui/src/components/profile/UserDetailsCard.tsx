"use client";

import { Button } from "@repo/ui/components/ui/button";
import { BadgeCheck, User2, Mail, Phone, MapPin, Calendar, Pencil } from "lucide-react";
import React from "react";

export interface UserDetailsCardProps {
  initials: string;
  name: string;
  role: string[]; // Array of roles from backend
  verified: boolean;
  location: string;
  phone: string;
  email: string;
  memberSince: string;
  onEditProfile?: () => void;
  onLogout?: () => void;
}

export function UserDetailsCard({
  initials,
  name,
  role,
  verified,
  location,
  phone,
  email,
  memberSince,
  onEditProfile,
  onLogout,
}: UserDetailsCardProps) {
  return (
    <div className="w-full rounded-md shadow-sm border border-[#1E293B14]/10 bg-white flex flex-col p-6 md:p-8 lg:p-12 space-y-8 md:space-y-11">
      {/* Avatar with initials */}
      <div className="w-16 h-16 md:w-20 md:h-20 mx-auto rounded-full bg-[#FFCF51]/10 flex items-center justify-center text-2xl md:text-3xl font-semibold text-[#FFCF51] mt-6 md:mt-0">
        {initials}
      </div>
      {/* Name and badges */}
      <div className="flex flex-col  items-center">
        <span className="text-xl md:text-2xl text-textdark font-semibold text-center break-words">{name}</span>
        <div className="flex flex-wrap items-center justify-center gap-2 mt-2">
          {/* Combined roles badge */}
          <span className="px-2 md:px-3 py-1 rounded-full border border-textdark/60 flex text-textdark/70 text-xs md:text-sm items-center gap-1">
            <User2 className="h-3 w-3" /> {role.join('/')}
          </span>
          {verified && (
            <span className="px-2 md:px-3 py-1 text-xs md:text-sm rounded-full bg-[#6AD072] text-white border-[#6AD072] border flex items-center gap-1">
              <BadgeCheck className="h-3 w-3" /> Verified
            </span>
          )}
        </div>
      </div>
      {/* Details */}
      <div className="flex flex-col gap-2 items-start md:items-center text-base md:text-lg text-textdark/60 w-full mt-2 mb-4 md:mb-6">
        <div className="flex items-center gap-2 w-full">
          <span className="w-6 flex justify-center md:w-auto flex-shrink-0">
            <MapPin className="h-4 w-4 md:h-5 md:w-5 text-gray-400"/>
          </span>
          <span className="break-words overflow-wrap-anywhere min-w-0 flex-1">{location}</span>
        </div>
        <div className="flex items-center gap-2 w-full">
          <span className="w-6 flex justify-center md:w-auto flex-shrink-0">
            <Phone className="h-4 w-4 md:h-5 md:w-5 text-gray-400" />
          </span>
          <span className="break-words overflow-wrap-anywhere min-w-0 flex-1">{phone}</span>
        </div>
        <div className="flex items-center gap-2 w-full">
          <span className="w-6 flex justify-center md:w-auto flex-shrink-0">
            <Mail className="h-4 w-4 md:h-5 md:w-5 text-gray-400" />
          </span>
          <span className="break-words overflow-wrap-anywhere min-w-0 flex-1 text-sm md:text-base">{email}</span>
        </div>
        <div className="flex items-center gap-2 w-full">
          <span className="w-6 flex justify-center md:w-auto flex-shrink-0">
            <Calendar className="h-4 w-4 md:h-5 md:w-5 text-gray-400" />
          </span>
          <span className="break-words overflow-wrap-anywhere min-w-0 flex-1">{memberSince}</span>
        </div>
      </div>
      {/* Buttons */}
      <div className="flex flex-col sm:flex-row md:flex-col gap-2 w-full">
        <Button
          variant="outline"
          className="w-full sm:w-1/2 md:w-full border-primary text-primary text-base md:text-lg font-medium flex items-center justify-center gap-2 hover:bg-primary/10 hover:text-primary bg-white"
          onClick={onEditProfile}
        >
          <Pencil className="h-4 w-4 md:h-5 md:w-5" />
          Edit Profile
        </Button>
        <Button
          variant="outline"
          className="w-full sm:w-1/2 md:w-full text-base md:text-lg text-textdark border-textdark/60 bg-white"
          onClick={onLogout}
        >
          Logout
        </Button>
      </div>
    </div>
  );
}
