"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@repo/ui/components/ui/dialog";
import { Button } from "@repo/ui/components/ui/button";
import { Card } from "@repo/ui/components/ui/card";
import { User, Truck, ShoppingCart, ArrowLeft } from "lucide-react";
import { RoleUploadForm } from "./RoleUploadForm";

// Utility function to get available roles (roles not yet added by user)
const getAvailableRoles = (
  userRoles?: ('BUYER' | 'DRIVER' | 'SELLER')[],
  documents?: {
    aadhaarNumber: string | null;
    aadhaarCardImage: string | null;
    panNumber: string | null;
    panCardImage: string | null;
    licenseNumber: string | null;
    licenseCategory: string | null;
    licenseFrontImage: string | null;
  }
): ('BUYER' | 'DRIVER' | 'SELLER')[] => {
  const allRoles: ('BUYER' | 'DRIVER' | 'SELLER')[] = ['BUYER', 'DRIVER', 'SELLER'];

  // If we have userRoles from API, use that
  if (userRoles && userRoles.length > 0) {
    return allRoles.filter(role => !userRoles.includes(role));
  }

  // Fallback: infer roles from documents
  const existingRoles: ('BUYER' | 'DRIVER' | 'SELLER')[] = [];

  // Check for DRIVER role - requires license information
  if (documents?.licenseNumber && documents?.licenseCategory && documents?.licenseFrontImage) {
    existingRoles.push("DRIVER");
  }

  // Check for BUYER role - requires Aadhaar information
  if (documents?.aadhaarNumber && documents?.aadhaarCardImage) {
    existingRoles.push("BUYER");
  }

  // Check for SELLER role - requires both Aadhaar and PAN information
  if (documents?.aadhaarNumber && documents?.aadhaarCardImage &&
      documents?.panNumber && documents?.panCardImage) {
    existingRoles.push("SELLER");
  }

  return allRoles.filter(role => !existingRoles.includes(role));
};

interface RoleUploadDialogProps {
  isOpen: boolean;
  onClose: () => void;
  userId: string;
  onUploadAdditional?: (formData: any) => void; // eslint-disable-line no-unused-vars
  userRoles?: ('BUYER' | 'DRIVER' | 'SELLER')[];
  documents?: {
    aadhaarNumber: string | null;
    aadhaarCardImage: string | null;
    panNumber: string | null;
    panCardImage: string | null;
    licenseNumber: string | null;
    licenseCategory: string | null;
    licenseFrontImage: string | null;
  };
  isSubmitting?: boolean;
}

export function RoleUploadDialog({
  isOpen,
  onClose,
  userId,
  onUploadAdditional,
  userRoles,
  documents,
  isSubmitting = false,
}: RoleUploadDialogProps) {
  const [selectedRole, setSelectedRole] = useState<"BUYER" | "DRIVER" | "SELLER" | null>(null);

  // Debug logging
  console.log('🔍 RoleUploadDialog: Props received', { isOpen, userId, userRoles, documents });

  // Get available roles (roles not yet added by user)
  const availableRoles = getAvailableRoles(userRoles, documents);

  const handleRoleSelect = (role: "BUYER" | "DRIVER" | "SELLER") => {
    setSelectedRole(role);
  };

  const handleBackToRoles = () => {
    setSelectedRole(null);
  };


  const handleCancel = () => {
    setSelectedRole(null);
    onClose();
  };

  const handleDialogOpenChange = (open: boolean) => {
    if (!open) {
      handleCancel();
    }
  };

  // Reusable function to render role cards
  const renderRoleCard = (
    role: "BUYER" | "DRIVER" | "SELLER",
    icon: React.ReactNode,
    title: string,
    description: string
  ) => (
    <Card
      className="p-4 sm:p-6 cursor-pointer hover:bg-primary/5 transition-colors border border-[#1E293B14]/10 active:scale-[0.98] sm:active:scale-100"
      onClick={() => handleRoleSelect(role)}
    >
      <div className="flex items-center space-x-3 sm:space-x-4">
        <div className="flex-shrink-0">
          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-primary/10 rounded-lg flex items-center justify-center">
            <div className="w-5 h-5 sm:w-6 sm:h-6">
              {icon}
            </div>
          </div>
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-base sm:text-lg font-medium text-textdark truncate">{title}</h3>
          <p className="text-xs sm:text-sm text-textdark/60 leading-relaxed line-clamp-2">{description}</p>
        </div>
      </div>
    </Card>
  );

  return (
    <Dialog open={isOpen} onOpenChange={handleDialogOpenChange} modal={false} >
      <DialogContent
        className="fixed mx-auto top-[55%] z-50 w-[calc(100vw-48px)] sm:w-[calc(100vw-64px)] md:w-full rounded-lg border border-primary/10 shadow-xl bg-white max-w-[85vw] sm:max-w-[80vw] md:max-w-2xl max-h-[90vh] sm:max-h-[85vh] overflow-y-auto p-4 sm:p-6 md:p-10 [&>button]:top-3 [&>button]:right-3 sm:[&>button]:top-6 sm:[&>button]:right-6"
        style={{
          transform: 'translate(-50%, -50%)',
          animation: 'none',
          transition: 'opacity 0.2s ease-in-out'
        }}
      >
        {!selectedRole ? (
          <>
            <DialogHeader className="space-y-2 sm:space-y-3 ">
              <DialogTitle className="text-lg sm:text-xl font-semibold text-textdark">
                Upload Documents
              </DialogTitle>
              <DialogDescription className="text-textdark/70 text-sm sm:text-base leading-relaxed">
                Select the role you want to add documents for. This will help us verify your identity for that specific role.
              </DialogDescription>

            </DialogHeader>

            <div className="space-y-3 sm:space-y-4 py-2 sm:py-4">
              {availableRoles.length === 0 ? (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-medium text-textdark mb-2">All Roles Added!</h3>
                  <p className="text-textdark/60 text-sm mb-3">
                    You have already added all available roles. No additional verification is needed.
                  </p>
                  {userRoles && userRoles.length > 0 && (
                    <div className="flex flex-wrap gap-2 justify-center">
                      {userRoles.map((role) => (
                        <span
                          key={role}
                          className="px-3 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full"
                        >
                          {role}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <>
                  {availableRoles.includes("BUYER") && renderRoleCard(
                    "BUYER",
                    <ShoppingCart className="h-6 w-6 text-primary" />,
                    "Buyer",
                    "Upload Aadhaar card for buyer verification"
                  )}

                  {availableRoles.includes("DRIVER") && renderRoleCard(
                    "DRIVER",
                    <Truck className="h-6 w-6 text-primary" />,
                    "Driver",
                    "Upload driving license for driver verification"
                  )}

                  {availableRoles.includes("SELLER") && renderRoleCard(
                    "SELLER",
                    <User className="h-6 w-6 text-primary" />,
                    "Seller",
                    "Upload Aadhaar and PAN card for seller verification"
                  )}
                </>
              )}
            </div>

            <div className="flex justify-end space-x-2 pt-3 sm:pt-4">
              <Button
                variant="outline"
                onClick={handleCancel}
                className="px-4 sm:px-6 text-sm sm:text-base"
              >
                Cancel
              </Button>
            </div>
          </>
        ) : (
          <>
            <DialogHeader className="space-y-3 sm:space-y-3 gap-0 sm:gap-2">
              {/* Mobile: Arrow and Close button on same line */}
              <div className="flex items-center justify-between sm:hidden">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleBackToRoles}
                  className="p-1.5"
                >
                  <ArrowLeft className="h-4 w-4" />
                </Button>
                <div className="text-lg font-semibold text-textdark">
                  {selectedRole === "DRIVER" ? "Driver" : selectedRole === "BUYER" ? "Buyer" : "Seller"} Verification
                </div>
                <div className="w-8 h-8"></div> {/* Spacer for centering */}
              </div>

              {/* Mobile: Description below */}
              <div className="sm:hidden">
                <DialogDescription className="text-textdark/70 text-sm leading-relaxed">
                  Fill in the required information and upload documents for verification.
                </DialogDescription>
              </div>

              {/* Desktop: Original layout */}
              <div className="hidden sm:flex items-start space-x-3">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleBackToRoles}
                  className="p-2 flex-shrink-0"
                >
                  <ArrowLeft className="h-4 w-4" />
                </Button>
                <div className="min-w-0 flex-1">
                  <DialogTitle className="text-xl font-semibold text-textdark">
                    {selectedRole === "DRIVER" ? "Driver" : selectedRole === "BUYER" ? "Buyer" : "Seller"} Verification
                  </DialogTitle>
                  <DialogDescription className="text-textdark/70 text-base leading-relaxed">
                    Fill in the required information and upload documents for verification.
                  </DialogDescription>
                </div>
              </div>
            </DialogHeader>

            <div className="pt-2 sm:pt-4">
              <RoleUploadForm
                role={selectedRole}
                userId={userId}
                onCancel={handleBackToRoles}
                isLoading={isSubmitting}
                onUploadAdditional={onUploadAdditional}
              />
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
