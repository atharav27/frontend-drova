import { useEffect } from 'react';
import { X, Upload } from 'lucide-react';
import { toast } from 'sonner';
import Image from 'next/image';
import { UseFormSetValue } from 'react-hook-form';
import { useCloudinaryImageUpload } from '~/hooks/useCloudinaryImageUpload';

const MAX_FILES = 5;
const MAX_FILE_SIZE_MB = 5;

// Type that works with both PostFormData and UpdatePostFormData
interface ImageUploadProps {
  imageUrls: string[];
  setImageUrls: React.Dispatch<React.SetStateAction<string[]>>;
  setValue: UseFormSetValue<any>; // Use any for more flexibility across form types
}

export function ImageUploadComponent({
  imageUrls,
  setImageUrls,
  setValue
}: ImageUploadProps) {
  const { uploadImages, validateFile, isUploading } = useCloudinaryImageUpload({
    maxFileSizeMB: MAX_FILE_SIZE_MB,
    allowedTypes: ["image/jpeg", "image/png", "image/webp"],
  });

  useEffect(() => {
    setValue("images", imageUrls); // Keep form in sync with uploaded images
  }, [imageUrls, setValue]);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const validFiles = Array.from(files).filter((file) => {
      const validationError = validateFile(file);
      if (validationError) {
        toast.error(validationError);
        return false;
      }
      return true;
    });

    if (imageUrls.length + validFiles.length > MAX_FILES) {
      toast.error(`You can only upload ${MAX_FILES} images total.`);
      return;
    }

    if (validFiles.length === 0) return;

    // Show loading state
    toast.loading(`Uploading ${validFiles.length} image(s)...`);

    try {
      const newUrls = await uploadImages(validFiles);
      const updated = [...imageUrls, ...newUrls];
      setImageUrls(updated);
      setValue("images", updated);
      toast.success(`Successfully uploaded ${newUrls.length} image(s)`);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Image upload failed";
      toast.error(message);
    } finally {
      // Clear loading state regardless of success/failure
      toast.dismiss();
    }

    // Reset the input value so the same files can be selected again if needed
    e.target.value = '';
  };

  const removeImage = (url: string) => {
    const updated = imageUrls.filter(img => img !== url);
    setImageUrls(updated);
    setValue("images", updated);
    toast.success("Image removed");
  };

  return (
    <div className="space-y-3 sm:space-y-4">
      {/* Custom Upload Area */}
      <label className="relative block border border-primary/30 bg-white rounded-lg p-8 sm:p-12 lg:p-16 cursor-pointer transition-colors">
        <div className="flex flex-col items-center justify-center text-center">
          <div className="mb-3 sm:mb-4 lg:mb-5">
            <Upload className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 text-textdark/70" />
          </div>
          <div className="space-y-1">
            <p className="text-textdark/70 font-medium text-base sm:text-lg lg:text-xl">Click to upload images</p>
            <p className="text-textdark/70 text-sm sm:text-base lg:text-lg">(JPG, PNG, WEBP)</p>
          </div>
        </div>

        <input
          type="file"
          accept="image/jpeg,image/png,image/webp"
          multiple
          className="sr-only"
          onChange={handleImageUpload}
          disabled={imageUrls.length >= MAX_FILES || isUploading}
        />
      </label>

      {imageUrls.length >= MAX_FILES && (
        <p className="text-xs sm:text-sm text-amber-600 text-center">Maximum images reached ({MAX_FILES}/{MAX_FILES})</p>
      )}

      {/* Show uploaded images */}
      {imageUrls.length > 0 && (
        <div className="mt-3 sm:mt-4 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
          {imageUrls
            .filter((url): url is string => typeof url === "string" && url.trim().length > 0)
            .map((url, index) => (
              <div key={index} className="relative aspect-square rounded-lg  border border-gray-200 group my-3">
                <Image
                  src={url}
                  alt={`Vehicle image ${index + 1}`}
                  fill
                  className="object-cover"
                  unoptimized={url.includes('localhost')}
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                />
                <button
                  type="button"
                  className="absolute top-0 right-1 sm:-top-3 sm:-right-3 z-10 bg-primary rounded-full p-2 shadow-md"
                  onClick={() => removeImage(url)}
                  aria-label="Remove image"
                >
                  <X className="h-4  w-4 sm:h-5 sm:w-5 text-white" />
                </button>
              </div>
            ))}
        </div>
      )}
    </div>
  );
}
