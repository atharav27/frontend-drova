'use client';

import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@repo/ui/components/ui/button';
import { useEffect, useState } from 'react';
import { PostFormData, createPostSchema } from '~/schema/posts/createPostSchema';
import { FormSelectController } from '@repo/ui/components/form/FormSelectController';
import { FormInputField } from '@repo/ui/components/form/FormInputField';
import { TextareaField } from '@repo/ui/components/form/TextareaField';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { ImageUploadComponent } from '../update-post/[id]/ImageUploadComponent';
import BackButton from '@repo/ui/components/login/BackButton';
import AuthGuard from '~/components/AuthGuard';
import { useCreateVehiclePost } from '~/hooks/query/useVehiclePosts';
import { ButtonLoader } from "@repo/ui/components/common/UnifiedLoader";
import { useUserProfile } from "~/hooks/query/useUserProfile";

export default function CreatePostPage() {
  const router = useRouter();
  const [currentAction, setCurrentAction] = useState<string | null>(null);
  const [imageUrls, setImageUrls] = useState<string[]>([
    'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZGRkIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkltYWdlIDE8L3RleHQ+PC9zdmc+',
    'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZGRkIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkltYWdlIDI8L3RleHQ+PC9zdmc+',
    'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZGRkIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkltYWdlIDM8L3RleHQ+PC9zdmc+',
    'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZGRkIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkltYWdlIDQ8L3RleHQ+PC9zdmc+',
    'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZGRkIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkltYWdlIDU8L3RleHQ+PC9zdmc+'
  ]);

  const createVehiclePost = useCreateVehiclePost();

  const methods = useForm<PostFormData>({
    resolver: zodResolver(createPostSchema),
    defaultValues: {
      fuelType: 'PETROL',
      vehicleCategory: 'HATCHBACK',
      transmission: 'MANUAL',
      images: [
        'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZGRkIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkltYWdlIDE8L3RleHQ+PC9zdmc+',
        'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZGRkIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkltYWdlIDI8L3RleHQ+PC9zdmc+',
        'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZGRkIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkltYWdlIDM8L3RleHQ+PC9zdmc+',
        'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZGRkIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkltYWdlIDQ8L3RleHQ+PC9zdmc+',
        'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZGRkIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkltYWdlIDU8L3RleHQ+PC9zdmc+'
      ],
      vehicleName: '',
      price: 0,
      location: '',
      kmsDriven: 0,
      yearOfManufacture: 2020,
      description: '',
      seatingCapacity: 5,
      engineDisplacement: 1197,
      mileage: 20,
      maxPower: 89,
      features: [],
      contactName: '',
      contactNumber: '',
      status: 'DRAFT',
      autoPublish: false,
    },
  });

  const { control, handleSubmit, formState: { errors, isDirty }, setValue: setFormValue } = methods;

  useEffect(() => {
    methods.register('images');
  }, [methods]);

  // Prefill contact information from authenticated user's profile
  const { data: userProfile } = useUserProfile();
  useEffect(() => {
    if (userProfile) {
      if (userProfile.fullName) {
        setFormValue('contactName', userProfile.fullName);
      }
      if (userProfile.phone) {
        setFormValue('contactNumber', userProfile.phone);
      }
    }
  }, [userProfile, setFormValue]);

  const onSubmit = async (data: PostFormData, event: any) => {
    const action = event.nativeEvent.submitter.value;
    setCurrentAction(action); // Track which action is being processed

    // Prepare final payload matching API exactly
    const finalPayload: PostFormData = {
      ...data,
      images: imageUrls, // Use current image URLs
      status: action === 'draft' ? 'DRAFT' : 'PUBLISHED'
    };

    createVehiclePost.mutate(finalPayload, {
      onSuccess: () => {
        const message = action === 'draft' ? "Draft saved successfully!" : "Post published successfully!";
        toast.success(message);
        setCurrentAction(null); // Reset action state
        router.push('/posts/user-posts');
      },
      onError: (error) => {
        const message = action === 'draft' ? "Error saving draft" : "Error publishing post";
        toast.error(`${message}: ${error.message}`);
        setCurrentAction(null); // Reset action state
      },
    });
  };

  return (
    <AuthGuard role="SELLER">
      <div>
        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(onSubmit)} className="container  py-6 sm:py-8 lg:py-10">
            <div className="space-y-6 sm:space-y-8">
              {/* Header */}
              <BackButton
                isOtpStep={true}
                onBackClick={() => router.back()}
                buttonText="Back to Listings"
              />

              {/* Vehicle Information Section */}
              <div className="space-y-8 sm:space-y-12 max-w-5xl mx-auto">
                <div>
                  <h2 className="text-primary text-xl sm:text-2xl font-medium pb-2 sm:pb-3 border-b border-primary/20">Vehicle Information</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mt-6 sm:mt-8">
                    <FormInputField
                      control={control}
                      name="vehicleName"
                      label="Vehicle Name"
                      placeholder="e.g. Tata Ace"
                    />
                    <FormInputField
                      control={control}
                      name="price"
                      label="Price ₹"
                      type="number"
                      placeholder="e.g. 400000"
                    />
                  </div>
                </div>

                {/* Vehicle Details Section */}
                <div>
                  <h2 className="text-primary text-xl sm:text-2xl font-medium pb-2 sm:pb-3 border-b border-primary/20">Vehicle Details</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mt-6 sm:mt-8">
                    <FormSelectController
                      name="vehicleCategory"
                      control={control}
                      label="Vehicle Category"
                      options={[
                        { label: "Hatchback", value: "HATCHBACK" },
                        { label: "Sedan", value: "SEDAN" },
                        { label: "SUV", value: "SUV" },
                        { label: "Truck", value: "TRUCK" }
                      ]}
                    />
                    <FormInputField
                      control={control}
                      name="location"
                      label="Location"
                      placeholder="Select Location"
                    />
                    <FormSelectController
                      name="fuelType"
                      control={control}
                      label="Fuel Type"
                      options={[
                        { label: "Petrol", value: "PETROL" },
                        { label: "Diesel", value: "DIESEL" },
                        { label: "Electric", value: "ELECTRIC" },
                        { label: "Hybrid", value: "HYBRID" }
                      ]}
                    />
                    <FormInputField
                      control={control}
                      name="kmsDriven"
                      label="Kilometers Driven"
                      type="number"
                      placeholder="e.g. 15000"
                    />
                    <FormSelectController
                      name="transmission"
                      control={control}
                      label="Transmission"
                      options={[
                        { label: "Manual", value: "MANUAL" },
                        { label: "Automatic", value: "AUTOMATIC" }
                      ]}
                    />
                  </div>
                </div>

                {/* Additional Vehicle Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                  <FormSelectController
                    name="seatingCapacity"
                    control={control}
                    label="Seating Capacity"
                    options={[
                      { label: "2", value: "2" },
                      { label: "3", value: "3" },
                      { label: "4", value: "4" },
                      { label: "5", value: "5" },
                      { label: "6", value: "6" },
                      { label: "7", value: "7" },
                      { label: "8", value: "8" }
                    ]}
                  />

                  <FormInputField
                    control={control}
                    name="engineDisplacement"
                    label="Engine Displacement (cc)"
                    type="number"
                    placeholder="1197"
                  />

                  <FormInputField
                    control={control}
                    name="mileage"
                    label="Mileage (km/l)"
                    type="number"
                    placeholder="22"
                  />

                  <FormInputField
                    control={control}
                    name="maxPower"
                    label="Max Power (HP)"
                    type="number"
                    placeholder="89"
                  />
                </div>

                {/* Vehicle Description */}
                <div>
                  <h2 className="text-primary text-xl sm:text-2xl font-medium pb-2 sm:pb-3 border-b border-primary/20">Vehicle Description</h2>
                  <div className="space-y-2 mt-6 sm:mt-8">
                    <TextareaField
                      control={control}
                      name="description"
                      label="Details/Description"
                      placeholder="Describe the condition, features and history of your vehicle..."
                      className="min-h-[120px] sm:min-h-[150px]"
                    />
                  </div>
                </div>

                {/* Vehicle Features */}
                <div>
                  <h2 className="text-primary text-xl sm:text-2xl font-medium pb-2 sm:pb-3 border-b border-primary/20">Vehicle Features</h2>
                  <div className="space-y-2 mt-6 sm:mt-8">
                    <TextareaField
                      control={control}
                      name="features"
                      label="Features"
                      placeholder="List features (one per line). Example: Alloy wheels, ABS, Dual airbags"
                      variant="styled"

                      className="min-h-[160px] sm:min-h-[200px] text-base scrollbar-none"
                    />
                  </div>
                </div>

                {/* Upload Images */}
                <div>
                  <h2 className="text-primary text-xl sm:text-2xl font-medium pb-2 sm:pb-3 border-b border-primary/20">Upload Images</h2>
                  <div className="space-y-4 mt-6 sm:mt-8">
                    <p className="text-textdark text-base sm:text-lg font-medium">Upload up to 5 images of your vehicle. First image will be used as the main image.</p>
                    <ImageUploadComponent
                      imageUrls={imageUrls}
                      setImageUrls={setImageUrls}
                      setValue={setFormValue}
                    />

                    {errors.images && <p className="text-xs sm:text-sm text-red-500 mt-2">{errors.images.message}</p>}
                  </div>
                </div>

                {/* Basic Details */}
                <div>
                  <h2 className="text-primary text-xl sm:text-2xl font-medium pb-2 sm:pb-3 border-b border-primary/20">Basic Details</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mt-6 sm:mt-8">
                    <FormInputField
                      control={control}
                      name="yearOfManufacture"
                      label="Year of Manufacture"
                      type="number"
                      placeholder="e.g. 2020"
                    />
                  </div>
                </div>

                {/* Contact Information */}
                <div>
                  <h2 className="text-primary text-xl sm:text-2xl font-medium pb-2 sm:pb-3 border-b border-primary/20">Contact Information</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mt-6 sm:mt-8">
                    <FormInputField
                      control={control}
                      name="contactName"
                      label="Your Name"
                      placeholder="Your Full Name"
                    />
                    <FormInputField
                      control={control}
                      name="contactNumber"
                      label="Contact Number"
                      placeholder="Your Phone Number"
                    />
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-4 sm:pt-6">
                  <Button
                    type="submit"
                    name="action"
                    value="published"
                    className="w-full sm:w-auto px-6 sm:px-8 py-2 sm:py-3 text-sm sm:text-base font-medium bg-primary text-white hover:bg-primary/90 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={createVehiclePost.isPending || !isDirty}
                  >
                    {createVehiclePost.isPending && currentAction === 'published' ? (
                      <ButtonLoader message="Publishing" textColor="text-white " textSize="text-sm sm:text-base"  />
                    ) : (
                      'Publish Listing'
                    )}
                  </Button>
                  <Button
                    type="submit"
                    name="action"
                    value="draft"
                    variant="outline"
                    disabled={createVehiclePost.isPending || !isDirty}
                    className="w-full sm:w-auto px-6 sm:px-8 py-2 sm:py-3 text-sm sm:text-base font-medium border-gray-300 text-gray-700 hover:bg-gray-50 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {createVehiclePost.isPending && currentAction === 'draft' ? (
                      <ButtonLoader message="Saving" textColor="text-textdark" textSize="text-sm sm:text-base" />
                    ) : (
                      'Save Draft'
                    )}
                  </Button>
                </div>

                {/* Listing Tips */}
                <div className="pt-3 sm:pt-4">
                  <h3 className="font-medium text-[#3B4973] mb-2 sm:mb-3 text-base sm:text-2xl">* Listing Tips</h3>
                  <ul className="text-sm sm:text-lg text-[#3B4973] space-y-1 sm:space-y-2 font-normal">
                    <li>• Clear, well-lit photos from multiple angles get more responses</li>
                    <li>• Be honest about the condition and include any known issues</li>
                    <li>• Include service history and ownership details</li>
                    <li>• Set a competitive price based on market rates</li>
                  </ul>
                </div>
              </div>
            </div>
          </form>
        </FormProvider>
      </div>
    </AuthGuard>
  );
}
