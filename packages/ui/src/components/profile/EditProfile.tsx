"use client";

import React, { useState, useMemo } from "react";
import { Button } from "@repo/ui/components/ui/button";
import { Input } from "@repo/ui/components/ui/input";
import { Label } from "@repo/ui/components/ui/label";
import { Card } from "@repo/ui/components/ui/card";

export interface EditProfileProps {
  initialData: {
    fullName: string;
    email: string;
    phone: string;
    location: string;
  };
  onSave: (data: {
    fullName: string;
    email: string;
    phone: string;
    location: string;
  }) => void;
  onCancel: () => void;
  isLoading?: boolean;
  error?: string | null;
}

export function EditProfile({
  initialData,
  onSave,
  onCancel,
  isLoading = false,
  error = null
}: EditProfileProps) {
  const [formData, setFormData] = useState(initialData);

  // Detect if any changes have been made
  const hasChanges = useMemo(() => {
    return JSON.stringify(formData) !== JSON.stringify(initialData);
  }, [formData, initialData]);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = () => {
    if (hasChanges && !isLoading) {
      onSave(formData);
    }
  };

  return (
    <Card className="p-4 md:p-6 lg:p-10 bg-white rounded-lg border border-[#1E293B14]/10 shadow-sm">
      <div className="space-y-8 md:space-y-12 lg:space-y-14 py-2 md:py-4 lg:py-5">
        <div>
          <h2 className="text-lg md:text-xl lg:text-2xl font-semibold text-textdark mb-1 md:mb-2">Profile Overview</h2>
          <p className="text-textdark/70 text-sm md:text-base lg:text-lg">View your profile details and recent activity.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 lg:gap-8">
          {/* Full Name */}
          <div className="space-y-1 md:space-y-2">
            <Label htmlFor="fullName" className="text-base md:text-lg lg:text-xl font-medium text-textdark">
              Full Name
            </Label>
            <Input
              id="fullName"
              type="text"
              value={formData.fullName}
              onChange={(e) => handleInputChange('fullName', e.target.value)}
              className="w-full px-3 md:px-4 py-2 md:py-3 border border-primary/30 rounded-md focus:ring-2 focus:ring-primary focus:border-primary text-sm md:text-base text-textdark placeholder:text-textdark/70 placeholder:text-sm md:placeholder:text-base"
              placeholder="John Joseph"
            />
          </div>

          {/* Email */}
          <div className="space-y-1 md:space-y-2">
            <Label htmlFor="email" className="text-base md:text-lg lg:text-xl font-medium text-textdark">
              Email
            </Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              className="w-full px-3 md:px-4 py-2 md:py-3 border border-primary/30 rounded-md focus:ring-2 focus:ring-primary focus:border-primary text-sm md:text-base text-textdark placeholder:text-textdark/70 placeholder:text-sm md:placeholder:text-base"
              placeholder="rajesh.kumar@example.com"
            />
          </div>

          {/* Phone */}
          <div className="space-y-1 md:space-y-2">
            <Label htmlFor="phone" className="text-base md:text-lg lg:text-xl font-medium text-textdark">
              Phone
            </Label>
            <Input
              id="phone"
              type="tel"
              value={formData.phone}
              onChange={(e) => handleInputChange('phone', e.target.value)}
              className="w-full px-3 md:px-4 py-2 md:py-3 border border-primary/30 rounded-md focus:ring-2 focus:ring-primary focus:border-primary text-sm md:text-base text-textdark placeholder:text-textdark/70 placeholder:text-sm md:placeholder:text-base"
              placeholder="+91 98765 43210"
            />
          </div>

          {/* Location */}
          <div className="space-y-1 md:space-y-2">
            <Label htmlFor="location" className="text-base md:text-lg lg:text-xl font-medium text-textdark">
              Location
            </Label>
            <Input
              id="location"
              type="text"
              value={formData.location}
              onChange={(e) => handleInputChange('location', e.target.value)}
              className="w-full px-3 md:px-4 py-2 md:py-3 border border-primary/30 rounded-md focus:ring-2 focus:ring-primary focus:border-primary text-sm md:text-base text-textdark placeholder:text-textdark/70 placeholder:text-sm md:placeholder:text-base"
              placeholder="Mumbai, Maharashtra"
            />
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
            <p className="text-sm font-medium">Error updating profile:</p>
            <p className="text-sm">{error}</p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row justify-center gap-3 md:gap-4 lg:gap-5 pt-2 md:pt-4">
          <Button
            variant="outline"
            onClick={onCancel}
            disabled={isLoading}
            className="px-8 md:px-12 lg:px-16 py-2 md:py-3 border-primary text-base md:text-lg text-primary bg-white hover:bg-white font-medium hover:text-primary/80 hover:border-primary/80 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            disabled={!hasChanges || isLoading}
            className="px-6 md:px-7 lg:px-8 py-2 md:py-3 bg-primary text-base md:text-lg text-white hover:bg-primary/90 font-medium disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-primary"
          >
            {isLoading ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Saving...
              </>
            ) : (
              'Save Changes'
            )}
          </Button>
        </div>
      </div>
    </Card>
  );
}
