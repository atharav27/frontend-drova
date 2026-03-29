'use client';

import { useForm, FormProvider } from 'react-hook-form';
import { Button } from '@repo/ui/components/ui/button';
import { PostFormData, useGetVehiclePostById, useUpdateVehiclePost } from '~/hooks/query/useVehiclePosts';

// Form interface that matches form field expectations
interface UpdateFormData {
  vehicleName: string;
  price: number;
  vehicleCategory: 'HATCHBACK' | 'SEDAN' | 'SUV' | 'TRUCK';
  location: string;
  fuelType: 'PETROL' | 'DIESEL' | 'ELECTRIC' | 'HYBRID';
  kmsDriven: number;
  seatingCapacity: string; // Form field expects string
  engineDisplacement: number;
  mileage: number;
  maxPower: number;
  description: string;
  features: string; // Form field expects string (textarea)
  images: string[];
  contactName: string;
  contactNumber: string;
  yearOfManufacture: number;
  transmission: 'MANUAL' | 'AUTOMATIC';
  status: 'DRAFT' | 'PUBLISHED' | 'SOLD';
  autoPublish: boolean;
}
import { useQueryClient } from '@tanstack/react-query';
import { DatePickerField } from '@repo/ui/components/form/DatePickerField';
import { FormSelectController } from '@repo/ui/components/form/FormSelectController';
import { FormInputField } from '@repo/ui/components/form/FormInputField';
import { TextareaField } from '@repo/ui/components/form/TextareaField';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { PageLoader, ButtonLoader } from "@repo/ui/components/common/UnifiedLoader";
import { ImageUploadComponent } from './ImageUploadComponent';
import BackButton from '@repo/ui/components/login/BackButton';
import AuthGuard from '~/components/AuthGuard';



export default function UpdatePostPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [didSetInitialImages, setDidSetInitialImages] = useState(false);
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const queryClient = useQueryClient();
  const updateVehiclePost = useUpdateVehiclePost();
  const { data: vehicleData, isLoading, refetch } = useGetVehiclePostById(params.id);
  const isSubmitting = updateVehiclePost.isPending;

  const methods = useForm<UpdateFormData>({
    defaultValues: {
      vehicleName: '',
      price: 0,
      vehicleCategory: 'HATCHBACK',
      location: '',
      fuelType: 'PETROL',
      kmsDriven: 0,
      seatingCapacity: '5',
      engineDisplacement: 1197,
      mileage: 20,
      maxPower: 89,
      description: '',
      features: '',
      images: [],
      contactName: '',
      contactNumber: '',
      yearOfManufacture: 2020,
      transmission: 'MANUAL',
      status: 'DRAFT',
      autoPublish: false,
    },
    mode: "all",
    reValidateMode: "onChange"
  });

  const { control, handleSubmit, setValue } = methods;

  // Set form data when vehicle data is loaded
  useEffect(() => {
    if (vehicleData && !didSetInitialImages) {
      // Handle images - vehicleData.images is string[] from API
      const imageKeys = Array.isArray(vehicleData.images) ? vehicleData.images : [];
      setImageUrls(imageKeys);

      // Map SinglePostData fields to PostFormData fields
      methods.reset({
        vehicleName: vehicleData.vehicleName || '',
        price: vehicleData.price || 0,
        vehicleCategory: vehicleData.vehicleCategory || 'HATCHBACK',
        location: vehicleData.location || '',
        fuelType: vehicleData.fuelType || 'PETROL',
        kmsDriven: vehicleData.kmsDriven || 0,
        seatingCapacity: String(vehicleData.seatingCapacity || 5),
        engineDisplacement: vehicleData.engineDisplacement || 1197,
        mileage: vehicleData.mileage || 20,
        maxPower: vehicleData.maxPower || 89,
        description: vehicleData.description || '',
        features: Array.isArray(vehicleData.features) ? vehicleData.features.join('\n') : '',
        images: imageKeys,
        contactName: vehicleData.contactName || '',
        contactNumber: vehicleData.contactNumber || '',
        yearOfManufacture: vehicleData.yearOfManufacture || 2020,
        transmission: vehicleData.transmission || 'MANUAL',
        status: vehicleData.status || 'DRAFT',
        autoPublish: vehicleData.autoPublish || false,
      });
      setDidSetInitialImages(true);
    }
  }, [vehicleData, didSetInitialImages, methods]);

  useEffect(() => {
    setDidSetInitialImages(false);
  }, [params.id]);



  // Form submission handler
  const onSubmit = async (data: UpdateFormData, event: any) => {
    const action = event.nativeEvent.submitter.value;
    const status = action === "draft" ? "DRAFT" : "PUBLISHED";

    // For updates, allow submission even without new images if existing images exist
    if (imageUrls.length === 0 && (!vehicleData?.images || vehicleData.images.length === 0)) {
      toast.error("Please upload at least one vehicle image");
      return;
    }

    // Use current imageUrls or fallback to existing images
    const finalImageUrls = imageUrls.length > 0 ? imageUrls : (vehicleData?.images || []);

    // Transform form data to API payload
    const finalPayload: PostFormData = {
      vehicleName: data.vehicleName,
      price: data.price,
      vehicleCategory: data.vehicleCategory,
      location: data.location,
      fuelType: data.fuelType,
      kmsDriven: data.kmsDriven,
      seatingCapacity: Number(data.seatingCapacity), // Convert string to number
      engineDisplacement: data.engineDisplacement,
      mileage: data.mileage,
      maxPower: data.maxPower,
      description: data.description,
      features: data.features.split('\n').map(f => f.trim()).filter(f => f.length > 0), // Convert string to array
      images: finalImageUrls,
      contactName: data.contactName,
      contactNumber: data.contactNumber,
      yearOfManufacture: data.yearOfManufacture,
      transmission: data.transmission,
      status,
      autoPublish: data.autoPublish,
    };

    console.log('🚀 Final Update Payload:', finalPayload);

    // Submit the data
    updateVehiclePost.mutate(
      { postid: params.id, data: finalPayload },
      {
        onSuccess: async (response) => {
          await refetch();
          toast.success("Post updated successfully!");
          console.log('✅ Update Response:', response);
          await queryClient.invalidateQueries({ queryKey: ['vehicle-post', params.id] });
          router.push('/posts/user-posts');
        },
        onError: (error) => {
          toast.error("Error updating post: " + (error.message || "Please try again"));
          console.error('❌ Update Error:', error);
        },
      }
    );
  };

  if (isLoading) return <PageLoader message="Loading post data..." />;

  if (!vehicleData) return (
    <div className="max-w-3xl mx-auto p-6 text-center">
      <p className="text-red-500">Post not found or failed to load.</p>
      <Button
        onClick={() => router.push('/posts/user-posts')}
        className="mt-4"
      >
        Return to Posts
      </Button>
    </div>
  );

  return (
    <AuthGuard role="SELLER">
      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmit)} className="container py-4 sm:py-6 lg:py-10">
          <div className="space-y-6 sm:space-y-8">
            {/* Header */}
            <BackButton
              isOtpStep={true}
              onBackClick={() => router.back()}
              buttonText="Back to Listings"
            />
            {/* Vehicle Information Section */}
            <div className="space-y-8 sm:space-y-12 lg:space-y-16 max-w-5xl mx-auto">
              <div>
                <h2 className="text-primary text-xl sm:text-2xl font-medium pb-2 sm:pb-3 border-b border-primary/20">Vehicle Information</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mt-6 sm:mt-8">
                  <FormInputField
                    control={control}
                    name="vehicleName"
                    label="Vehicle Name"
                    placeholder="e.g. Suzuki Swift Desire"
                  />
                  <FormInputField
                    control={control}
                    name="price"
                    label="Price ₹"
                    type="number"
                    placeholder="5,00,000"
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
                    placeholder="Bangalore, India"
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
                    placeholder="45,000 km"
                  />
                  <DatePickerField
                    control={control}
                    name="yearOfManufacture"
                    label="Year of Manufacture"
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
            </div>



            {/* Vehicle Description */}
            <div>
              <h2 className="text-primary text-xl sm:text-2xl font-medium pb-2 sm:pb-3 border-b border-primary/20">Vehicle Description</h2>
              <div className="space-y-2 mt-6 sm:mt-8">
                <TextareaField
                  control={control}
                  name="description"
                  label="Detailed Description"
                  placeholder="Well-maintained Suzuki Swift Dzire sedan in excellent condition. Single owner, full service history available. Recently serviced and runs smoothly. New battery and tires fitted 6 months ago. AC and infotainment system functioning perfectly. No major accidents or repairs. Great choice for personal or commercial use. Available for test drive upon request."
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
                  placeholder="Power Steering&#10;AC&#10;Power Windows&#10;Central Locking&#10;&#10;Enter each feature on a new line"
                  className="min-h-[120px] sm:min-h-[150px]"
                />
                <p className="text-sm sm:text-base text-textdark/50">Enter each feature on a new line</p>
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
                  setValue={setValue}
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
                  placeholder="Rajesh Kumar"
                />
                <FormInputField
                  control={control}
                  name="contactNumber"
                  label="Contact Number"
                  placeholder="+91 7877656789"
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div>
              <Button
                type="submit"
                name="action"
                value="draft"
                className=" bg-primary text-white hover:bg-primary/90 h-10 sm:h-12 text-base sm:text-lg font-medium"
              >
                {isSubmitting ? <ButtonLoader message="Updating" textColor="text-textdark" textSize="text-sm sm:text-base" /> : "Save Changes"}
              </Button>
            </div>
          </div>
        </div>
      </form>
    </FormProvider>
    </AuthGuard>
  );
}
