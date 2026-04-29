"use client";

import { useCallback, useState } from "react";

const DEFAULT_ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];
const MB_IN_BYTES = 1024 * 1024;

interface UseCloudinaryImageUploadOptions {
  cloudName?: string;
  uploadPreset?: string;
  maxFileSizeMB?: number;
  allowedTypes?: string[];
}

export function useCloudinaryImageUpload(options: UseCloudinaryImageUploadOptions = {}) {
  const {
    cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
    uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET,
    maxFileSizeMB = 2,
    allowedTypes = DEFAULT_ALLOWED_TYPES,
  } = options;

  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const validateFile = useCallback(
    (file: File): string | null => {
      if (!allowedTypes.includes(file.type)) {
        return `${file.name} is not a supported image format.`;
      }

      if (file.size > maxFileSizeMB * MB_IN_BYTES) {
        return `${file.name} exceeds ${maxFileSizeMB}MB.`;
      }

      return null;
    },
    [allowedTypes, maxFileSizeMB]
  );

  const uploadSingle = useCallback(
    async (file: File): Promise<string> => {
      const validationError = validateFile(file);
      if (validationError) {
        throw new Error(validationError);
      }

      if (!cloudName || !uploadPreset) {
        throw new Error("Cloudinary upload is not configured.");
      }

      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", uploadPreset);

      const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
        method: "POST",
        body: formData,
      });

      const result = await response.json();
      if (!response.ok || !result?.secure_url) {
        const message = result?.error?.message || "Image upload failed";
        throw new Error(message);
      }

      return result.secure_url as string;
    },
    [cloudName, uploadPreset, validateFile]
  );

  const uploadImage = useCallback(
    async (file: File): Promise<string> => {
      setIsUploading(true);
      setError(null);
      try {
        return await uploadSingle(file);
      } catch (err) {
        const message = err instanceof Error ? err.message : "Image upload failed";
        setError(message);
        throw err;
      } finally {
        setIsUploading(false);
      }
    },
    [uploadSingle]
  );

  const uploadImages = useCallback(
    async (files: File[]): Promise<string[]> => {
      setIsUploading(true);
      setError(null);
      try {
        return await Promise.all(files.map(uploadSingle));
      } catch (err) {
        const message = err instanceof Error ? err.message : "Image upload failed";
        setError(message);
        throw err;
      } finally {
        setIsUploading(false);
      }
    },
    [uploadSingle]
  );

  return {
    uploadImage,
    uploadImages,
    validateFile,
    isUploading,
    error,
  };
}
