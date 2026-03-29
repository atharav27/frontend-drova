import React from "react";
import { Controller, Control, FieldErrors } from "react-hook-form";
import { Button } from "@repo/ui/components/ui/button";
import { Label } from "@repo/ui/components/ui/label";

interface PhoneInputCardProps {
  control: Control<{ phone: string }>;
  onSubmit: (e: React.FormEvent) => void;
  errors: FieldErrors<{ phone: string }>;
  isPending: boolean;
  isPhoneValid: boolean;
  phoneValue: string;
  onPhoneChange: (value: string) => void;
  label?: string;
  disclaimer?: React.ReactNode;
  customStyle?: string;
}

export default function PhoneInputCard({
  control,
  onSubmit,
  errors,
  isPending,
  isPhoneValid,
  phoneValue,
  onPhoneChange,
  label,
  disclaimer,
  customStyle,
}: PhoneInputCardProps) {
  return (
    <div className="bg-[#FFFFFF] shadow-sm rounded-sm w-full p-6 sm:p-10 lg:p-16 ">
      <div className="space-y-4 sm:space-y-6">
        <form onSubmit={onSubmit} className="space-y-4 sm:space-y-6">
          {/* Phone Number Input */}
          <div>
            <Label htmlFor="phone" className="text-gray-700 text-xl z font-medium mb-2 sm:mb-1 block">
              {label || "Phone Number"}
            </Label>
            <p className="text-gray-500 text-md z mb-2 sm:mb-5">Enter your phone number to receive a verification code</p>
            <Controller
              control={control}
              name="phone"
              render={({ field: { onChange, value } }) => (
                <div
                  className="relative w-full h-11 sm:h-12 border-2 border-gray-200 rounded-lg bg-[#FBFBFB]"
                  style={{
                    ['--focus-ring' as any]: 'none',
                    ['--webkit-focus-ring-color' as any]: 'transparent'
                  } as React.CSSProperties}
                >
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <span className="text-gray-500 text-sm sm:text-base">+91</span>
                    <div className="h-6 w-px bg-gray-300 mx-2"></div>
                  </div>
                  <input
                    type="tel"
                    value={value?.replace('+91', '') || ''}
                    onChange={(e) => {
                      const phoneNumber = e.target.value.replace(/\D/g, '');
                      if (phoneNumber.length <= 10) {
                        onChange(`+91${phoneNumber}`);
                        onPhoneChange(`+91${phoneNumber}`);
                      }
                    }}
                    maxLength={10}
                    className="w-full h-full pl-16 pr-3 bg-transparent border-0 focus:outline-none focus:ring-0 placeholder-gray-400"
                    placeholder="Enter your Phone Number"
                    style={{
                      outline: 'none !important',
                      boxShadow: 'none !important',
                      WebkitAppearance: 'none',
                      MozAppearance: 'textfield'
                    } as React.CSSProperties}
                  />
                </div>
              )}
            />
            {/* {errors.phone && (
              <p className="text-red-500 text-sm mt-2">
                {errors.phone.message}
              </p>
            )} */}
          </div>
          <div className="space-y-3">
            <Button
              type="submit"
              className="w-full h-11 sm:h-12 bg-primary hover:bg-primary/90 text-white rounded-lg font-medium text-sm sm:text-base"
              disabled={isPending || !isPhoneValid}
            >
              {isPending ? "Sending..." : "Send OTP"}
            </Button>
            <p className={`text-[#303852A6]/65 text-xs mb-2 sm:mb-5 ${customStyle || ''}`}>{disclaimer}</p>
          </div>
        </form>


      </div >
    </div >
  );
}
