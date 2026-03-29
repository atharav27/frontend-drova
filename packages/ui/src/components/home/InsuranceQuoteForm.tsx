'use client';

import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@repo/ui/components/ui/button';
import { Input } from '@repo/ui/components/ui/input';
import { Label } from '@repo/ui/components/ui/label';
import { ShieldCheck } from 'lucide-react';

const formSchema = z.object({
  fullName: z.string().min(2, { message: 'Full name must be at least 2 characters.' }),
  phoneNumber: z.string().regex(/^\+?[1-9]\d{1,14}$/, { message: 'Invalid phone number format.' }),
  city: z.string().min(2, { message: 'City must be at least 2 characters.' }),
  vehicleType: z.string().min(2, { message: 'Vehicle type must be at least 2 characters.' }),
});

type FormData = z.infer<typeof formSchema>;

export default function InsuranceQuoteForm() {
  const content = {
    title: "Need Vehicle Insurance?",
    description: "We offer specialized insurance packages for commercial vehicles with competitive rates. Fill the form and our insurance expert will call you back.",
    trustText: "Trusted by 5,000+ vehicle owners",
    formTitle: "Get Insurance Quote",
    submitButtonText: "Request Callback",
    disclaimerText: "* By submitting, you agree to our terms and privacy policy.",
  };

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: '',
      phoneNumber: '',
      city: '',
      vehicleType: '',
    },
  });

  const processForm: SubmitHandler<FormData> = async (data) => {
    console.log('Form Data:', data);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    alert('Form submitted successfully! We will call you back shortly.');
    reset();
  };

  return (
    <section className="py-8 sm:py-12 md:py-20">
      <div className="container ">
        <div className="flex flex-col md:flex-row md:justify-between items-center gap-8 md:gap-12 lg:gap-16">
          {/* Left Content Section */}
          <div className="w-full md:w-auto text-center md:text-left space-y-4 sm:space-y-6 md:space-y-8">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-[#3B4973]">
              {content.title}
            </h2>
            <p className="text-base sm:text-lg text-slate-600 max-w-full md:max-w-xl">
              {content.description}
            </p>
            <div className="flex flex-col items-center space-y-2 sm:flex-row sm:space-y-0 sm:space-x-3 text-slate-700 justify-center md:justify-start">
              <div className="bg-[linear-gradient(to_bottom,_rgba(242,245,255,0.9),_rgba(107,125,179,0.6))] p-2 sm:p-3 rounded-full">
                <ShieldCheck className="w-6 h-6  text-primary" />
              </div>
              <span className="text-sm sm:text-base md:text-lg font-medium text-primary">{content.trustText}</span>
            </div>
          </div>

          {/* Right Form Section */}
          <div className="w-full md:max-w-md bg-white shadow-md rounded-lg p-6 sm:p-8 md:p-10 mt-8 md:mt-0">
            <h3 className="text-lg sm:text-xl md:text-xl font-semibold text-textdark mb-4 sm:mb-5 md:mb-6">
              {content.formTitle}
            </h3>
            <form onSubmit={handleSubmit(processForm)} className="space-y-4 sm:space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
                <div>
                  <Label htmlFor="fullName" className="block text-xs sm:text-sm font-medium text-slate-700 mb-1">Full Name</Label>
                  <Input id="fullName" {...register("fullName")} placeholder="Enter your name" className={`${errors.fullName ? 'border-red-500' : 'border-gray-300'} text-sm sm:text-base`} />
                  {errors.fullName && <p className="text-xs sm:text-sm text-red-600 mt-1">{errors.fullName.message}</p>}
                </div>
                <div>
                  <Label htmlFor="phoneNumber" className="block text-xs sm:text-sm font-medium text-slate-700 mb-1">Phone Number</Label>
                  <Input id="phoneNumber" {...register("phoneNumber")} placeholder="Enter your phone" className={`${errors.phoneNumber ? 'border-red-500' : 'border-gray-300'} text-sm sm:text-base`} />
                  {errors.phoneNumber && <p className="text-xs sm:text-sm text-red-600 mt-1">{errors.phoneNumber.message}</p>}
                </div>
                <div>
                  <Label htmlFor="city" className="block text-xs sm:text-sm font-medium text-slate-700 mb-1">City</Label>
                  <Input id="city" {...register("city")} placeholder="Enter your city" className={`${errors.city ? 'border-red-500' : 'border-gray-300'} text-sm sm:text-base`} />
                  {errors.city && <p className="text-xs sm:text-sm text-red-600 mt-1">{errors.city.message}</p>}
                </div>
                <div>
                  <Label htmlFor="vehicleType" className="block text-xs sm:text-sm font-medium text-slate-700 mb-1">Vehicle Type</Label>
                  <Input id="vehicleType" {...register("vehicleType")} placeholder="Enter your vehicle type" className={`${errors.vehicleType ? 'border-red-500' : 'border-gray-300'} text-sm sm:text-base`} />
                  {errors.vehicleType && <p className="text-xs sm:text-sm text-red-600 mt-1">{errors.vehicleType.message}</p>}
                </div>
              </div>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-primary hover:bg-primary/80 text-white font-semibold py-2.5 sm:py-3 px-4 rounded-lg text-sm sm:text-base"
              >
                {isSubmitting ? 'Submitting...' : content.submitButtonText}
              </Button>
              <p className="text-xs text-slate-500 text-center">
                {content.disclaimerText}
              </p>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
