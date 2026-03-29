"use client";

import React, { useState } from "react";
import { Card } from "@repo/ui/components/ui/card";
import { Button } from "@repo/ui/components/ui/button";
import { FileText, Upload, CreditCard } from "lucide-react";
import { RoleUploadDialog } from "./RoleUploadDialog";

interface Document {
  id: string;
  type: string;
  title: string;
  number: string | null;
  validUntil?: string;
  isUploaded: boolean;
  icon: React.ReactNode;
  imageUrl?: string | null;
}

interface UserDocuments {
  aadhaarNumber: string | null;
  aadhaarCardImage: string | null;
  panNumber: string | null;
  panCardImage: string | null;
  licenseNumber: string | null;
  licenseCategory: string | null;
  licenseFrontImage: string | null;
}

interface ProfileDocumentsTabProps {
  isEditing?: boolean;
  documents?: UserDocuments;
  onViewDocument?: (documentId: string) => void; // eslint-disable-line no-unused-vars
  onDeleteDocument?: (documentId: string) => void; // eslint-disable-line no-unused-vars
  onUploadAdditional?: (formData: any) => void; // eslint-disable-line no-unused-vars
  userId?: string;
  userRoles?: ('BUYER' | 'DRIVER' | 'SELLER')[];
  isSubmitting?: boolean;
}

export function ProfileDocumentsTab({
  isEditing = false,
  documents,
  onViewDocument,
  onDeleteDocument,
  onUploadAdditional,
  userId,
  userRoles,
  isSubmitting = false,
}: ProfileDocumentsTabProps) {
  const [isRoleDialogOpen, setIsRoleDialogOpen] = useState(false);

  const handleUploadClick = () => {
    console.log('🔍 ProfileDocumentsTab: Upload button clicked, userId:', userId);
    setIsRoleDialogOpen(true);
  };


  const handleCloseDialog = () => {
    setIsRoleDialogOpen(false);
  };

  // Create documents array from documents data
  const documentsList: Document[] = React.useMemo(() => {
    const docs: Document[] = [];

    // Aadhaar Card
    if (documents?.aadhaarNumber) {
      docs.push({
        id: "aadhaar-card",
        type: "Aadhaar Card",
        title: "Aadhaar Card",
        number: documents.aadhaarNumber,
        isUploaded: !!documents.aadhaarCardImage,
        imageUrl: documents.aadhaarCardImage,
        icon: <CreditCard className="h-5 w-5 md:h-7 md:w-7 text-primary" />
      });
    }

    // PAN Card
    if (documents?.panNumber) {
      docs.push({
        id: "pan-card",
        type: "PAN Card",
        title: "PAN Card",
        number: documents.panNumber,
        isUploaded: !!documents.panCardImage,
        imageUrl: documents.panCardImage,
        icon: <CreditCard className="h-5 w-5 md:h-7 md:w-7 text-primary" />
      });
    }

    // Driving License
    if (documents?.licenseNumber) {
      docs.push({
        id: "driving-license",
        type: "Driving License",
        title: "Driving License",
        number: documents.licenseNumber,
        validUntil: documents.licenseCategory ? `Category: ${documents.licenseCategory}` : undefined,
        isUploaded: !!documents.licenseFrontImage,
        imageUrl: documents.licenseFrontImage,
        icon: <CreditCard className="h-5 w-5 md:h-7 md:w-7 text-primary" />
      });
    }

    return docs;
  }, [documents]);


  // If no documents are available, show a message
  if (documentsList.length === 0) {
    return (
      <div className="space-y-6 md:space-y-8 bg-white rounded-lg p-6 md:p-8 border border-[#1E293B14]/10 shadow-sm h-fit">
        <div className="mb-6">
          <h2 className="text-lg md:text-xl font-semibold text-textdark mb-2">Verification Documents</h2>
          <p className="text-textdark/60 text-sm md:text-base">No documents uploaded yet.</p>
        </div>

        <div className="px-4 sm:px-6 md:px-10 py-4 sm:py-6 md:py-10 border border-[#1E293B14]/10 rounded-lg">
          <div className="text-center space-y-4 sm:space-y-3">
            <div className="flex justify-center">
              <div className="flex items-center justify-center">
                <Upload className="h-5 w-5 sm:h-6 sm:w-6 md:h-7 md:w-7 text-primary/60" />
              </div>
            </div>
            <div>
              <h3 className="text-sm sm:text-base md:text-lg font-medium text-textdark/50 mb-2">
                Upload Documents
              </h3>
              <p className="text-base sm:text-lg md:text-xl font-normal text-textdark mb-3 md:mb-4 max-w-sm sm:max-w-md md:max-w-xl mx-auto px-2">
                Upload your identity and professional documents for verification.
              </p>
            </div>
            <div className="pt-4">
              <Button
                onClick={handleUploadClick}
                variant="outline"
                className="px-10 sm:px-16 md:px-20 py-1 sm:py-1 md:py-1.5 mt-3 sm:mt-4 md:mt-4 border-primary text-primary bg-white hover:bg-white hover:text-primary font-medium text-base sm:text-lg md:text-xl"
              >
                Upload
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 md:space-y-8 bg-white rounded-lg p-6 md:p-8 border border-[#1E293B14]/10 shadow-sm h-fit">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-xl md:text-2xl font-semibold text-textdark mb-1">Verification Documents</h2>
        <p className="text-textdark/70 text-base md:text-lg">View your identity and professional documents.</p>
      </div>

      {/* Documents List */}
      <div className="space-y-4 md:space-y-6 overflow-hidden">
        {documentsList.map((document) => (
          <Card key={document.id} className="p-6 lg:p-8 border border-[#1E293B14]/10  overflow-hidden shadow-sm">
            <div className="flex flex-col lg:flex-row md:items-stretch md:justify-between gap-6 lg:gap-12 ">
              {/* Left side - Document info */}
              <div className="flex items-start gap-3 md:gap-4 flex-1">
                <div className="flex-1 space-y-3 md:space-y-4">
                  <div className="flex items-center gap-2">
                    <div className="">
                      {document.icon}
                    </div>
                    <h3 className="text-sm sm:text-base md:text-lg font-medium text-primary">
                      {document.title}
                    </h3>
                  </div>

                  <div className="space-y-2 md:space-y-3">
                    <div>
                      <div className="text-xs sm:text-sm md:text-base text-textdark/50">
                        {document.type === "Driving License" ? "License Number" :
                          document.type === "Aadhaar Card" ? "Aadhaar Number" :
                            "PAN Number"}
                      </div>
                      <div className="text-sm sm:text-base md:text-lg font-normal text-textdark break-words">
                        {document.number}
                      </div>
                    </div>

                    {document.validUntil && (
                      <div>
                        <div className="text-xs sm:text-sm md:text-base text-textdark/50">
                          Category
                        </div>
                        <div className="text-sm sm:text-base md:text-lg font-normal text-textdark break-words">
                          {document.validUntil}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Right side - Document icon and actions */}
              <div className="w-full md:flex-1 space-y-3 md:space-y-4">
                <div className="bg-primary/5 flex-1 flex flex-col items-center justify-center rounded-xl md:rounded-2xl p-4 sm:p-6 md:p-8 gap-3 md:gap-4">
                  <div className="text-gray-300">
                    <FileText className="h-6 w-6 sm:h-8 sm:w-8 md:h-12 md:w-12 text-primary/60" />
                  </div>
                  <div className="flex flex-col gap-2 items-center w-full">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onViewDocument?.(document.id)}
                      className="text-primary/60 hover:text-primary/40 text-xs sm:text-sm md:text-sm font-bold p-0 h-auto w-full text-center"
                    >
                      {document.isUploaded ? "View Uploaded" : "Upload"} {document.type === "Driving License" ? "License" :
                        document.type === "Aadhaar Card" ? "Aadhaar" :
                          "PAN Card"}
                    </Button>
                  </div>
                </div>
                {isEditing && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onDeleteDocument?.(document.id)}
                    className="px-3 sm:px-4 md:px-6 py-1.5 text-sm sm:text-base md:text-base font-bold rounded-lg sm:rounded-xl md:rounded-xl border border-primary text-primary hover:bg-white hover:text-primary/90 hover:border-primary/90 w-full bg-white h-auto"
                  >
                    Delete
                  </Button>
                )}
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Upload Additional Documents Section */}
      <div className="px-4 sm:px-6 md:px-10 py-4 sm:py-6 md:py-10 border border-[#1E293B14]/10 rounded-lg">
        <div className="text-center space-y-4 sm:space-y-3">
          <div className="flex justify-center">
            <div className="flex items-center justify-center">
              <Upload className="h-5 w-5 sm:h-6 sm:w-6 md:h-7 md:w-7 text-primary/60" />
            </div>
          </div>
          <div>
            <h3 className="text-sm sm:text-base md:text-lg font-medium text-textdark/50 mb-2">
              Upload Additional Documents
            </h3>
            <p className="text-base sm:text-lg md:text-xl font-normal text-textdark mb-3 md:mb-4 max-w-sm sm:max-w-md md:max-w-xl mx-auto px-2">
              Add insurance certificates, vehicle registration papers, or other professional documents.
            </p>
          </div>
          <div className="pt-4">
            <Button
              onClick={handleUploadClick}
              variant="outline"
              className="px-10 sm:px-16 md:px-20 py-1 sm:py-1 md:py-1.5 mt-3 sm:mt-4 md:mt-4 border-primary text-primary bg-white hover:bg-white hover:text-primary font-medium text-base sm:text-lg md:text-xl"
            >
              Upload
            </Button>
          </div>
        </div>
      </div>

      {/* Role Upload Dialog */}
      {userId && (
        <RoleUploadDialog
          isOpen={isRoleDialogOpen}
          onClose={handleCloseDialog}
          userId={userId}
          onUploadAdditional={onUploadAdditional}
          userRoles={userRoles}
          documents={documents}
          isSubmitting={isSubmitting}
        />
      )}
      {!userId && (
        <div style={{ display: 'none' }}>
          Debug: No userId provided - {JSON.stringify({ userId, userRoles })}
        </div>
      )}
    </div>
  );
}
