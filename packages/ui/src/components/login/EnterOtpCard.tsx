import React from "react";
import { Controller, Control, FieldErrors } from "react-hook-form";
import { Button } from "@repo/ui/components/ui/button";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@repo/ui/components/ui/input-otp";

interface EnterOtpCardProps {
  control: Control<{ otp: string; phone: string }>;
  onSubmit: (e: React.FormEvent) => void;
  errors: FieldErrors<{ otp: string; phone: string }>;
  isVerifyingOtp: boolean;
  isOtpValid: boolean;
  submittedPhone: string;
  timer: number;
  resendAvailable: boolean;
  onResendOtp: () => void;
  onChangePhoneNumber: () => void;
  otpValue: string;
  onOtpChange: (value: string) => void;
}

export default function EnterOtpCard({
  control,
  onSubmit,
  errors,
  isVerifyingOtp,
  isOtpValid,
  submittedPhone,
  timer,
  resendAvailable,
  onResendOtp,
  onChangePhoneNumber,
  otpValue,
  onOtpChange
}: EnterOtpCardProps) {
  return (
    <div className="bg-[#FFFFFF] shadow-sm rounded-sm w-full p-6 sm:p-10 lg:p-16 my-6 sm:my-8 lg:my-10">
      <div className="space-y-4 sm:space-y-5 bg-[#FFFFFF]">
        {/* OTP Section */}
        <div>
          <h2 className="text-lg sm:text-xl font-medium text-textdark mb-2">Enter OTP</h2>
          <p className="text-sm sm:text-md mb-4 sm:mb-6 text-textdark/70 break-words">
            A one-time password has been sent to {submittedPhone}
          </p>

          <form onSubmit={onSubmit} className="space-y-4 sm:space-y-5">
            <div className="flex justify-center">
              <Controller
                control={control}
                name="otp"
                render={({ field: { onChange, value } }) => (
                  <div
                    style={{
                      ['--focus-ring' as any]: 'none',
                      ['--webkit-focus-ring-color' as any]: 'transparent'
                    } as React.CSSProperties}>
                    <InputOTP maxLength={6} value={value} onChange={(val) => {
                      onChange(val);
                      onOtpChange(val);
                    }}>
                      <InputOTPGroup className="gap-1 sm:gap-2 md:gap-3">
                        {[...Array(6)].map((_, i) => (
                          <InputOTPSlot
                            key={i}
                            index={i}
                            className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 text-sm sm:text-base md:text-lg border-1 border-gray-200 bg-[#FBFBFB] rounded-lg focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none focus:shadow-none focus:box-shadow-none [&:focus]:outline-none [&:focus]:shadow-none"
                            style={{
                              outline: 'none',
                              boxShadow: 'none',
                              WebkitAppearance: 'none',
                              MozAppearance: 'textfield'
                            } as React.CSSProperties}
                          />
                        ))}
                      </InputOTPGroup>
                    </InputOTP>
                  </div>
                )}
              />
            </div>

            {errors.otp && (
              <p className="text-red-500 text-sm text-center">
                {errors.otp.message}
              </p>
            )}

            {/* Resend OTP */}
            <div className="text-center">
              {resendAvailable ? (
                <button
                  type="button"
                  onClick={onResendOtp}
                  className="text-primary hover:text-primary/80 text-sm font-medium"
                >
                  Resend OTP
                </button>
              ) : (
                <p className="text-textdark/50 text-sm">
                  Resend OTP in <span className="font-semibold text-primary">{timer} sec</span>
                </p>
              )}
            </div>

            <Button
              type="submit"
              className="w-full h-11 sm:h-12 bg-primary hover:bg-primary/90 text-white rounded-lg font-medium text-sm sm:text-base"
              disabled={isVerifyingOtp || !isOtpValid}
            >
              {isVerifyingOtp ? "Verifying..." : "Verify & Sign In"}
            </Button>

            {/* Change Phone Number */}
            <div className="text-center">
              <button
                type="button"
                onClick={onChangePhoneNumber}
                className="text-primary hover:text-primary/80 text-sm sm:text-md font-medium"
              >
                Change Phone Number
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
