"use client";

import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { toast } from "sonner";

// API hooks (local to Auth app)
import { useSendOtp, useSignInPhone } from "~/hooks/useAuthMutations";

// Components
import BackButton from "@repo/ui/components/login/BackButton";
import Header from "@repo/ui/components/login/Header";
import PhoneInputCard from "@repo/ui/components/login/PhoneInputCard";
import EnterOtpCard from "@repo/ui/components/login/EnterOtpCard";
import { SignInCompleteCard } from "@repo/ui/components/login/SignInCompleteCard";

const phoneSchema = z.object({
  phone: z.string().min(12, "Please enter a valid phone number (e.g., +91XXXXXXXXXX)").regex(/^\+91\d{10}$/, "Must be a valid Indian phone number (+91XXXXXXXXXX)"),
});

const otpSchema = z.object({
  otp: z.string().length(6, "OTP must be 6 digits"),
  phone: z.string(),
});

export default function LoginPage() {
  const [currentStep, setCurrentStep] = useState<"phoneInput" | "otpInput" | "signInComplete">("phoneInput");
  const [submittedPhone, setSubmittedPhone] = useState<string>("");
  const [userRoles, setUserRoles] = useState<string[]>([]);

  // Timer and OTP resend states
  const [timer, setTimer] = useState(30);
  const [resendAvailable, setResendAvailable] = useState<boolean>(false);

  // API hooks
  const sendOtpMutation = useSendOtp();
  const signInPhoneMutation = useSignInPhone();

  // Form instances
  const phoneForm = useForm<z.infer<typeof phoneSchema>>({
    resolver: zodResolver(phoneSchema),
    defaultValues: { phone: "" },
  });

  const otpForm = useForm<z.infer<typeof otpSchema>>({
    resolver: zodResolver(otpSchema),
    defaultValues: { otp: "", phone: "" },
  });

  // Timer effect
  useEffect(() => {
    if (currentStep === "otpInput" && submittedPhone) {
      if (timer === 0) {
        setResendAvailable(true);
        return;
      }
      const intervalId = setInterval(() => setTimer((t) => t - 1), 1000);
      return () => clearInterval(intervalId);
    }
  }, [currentStep, timer, submittedPhone]);

  useEffect(() => {
    if (submittedPhone) {
      otpForm.setValue("phone", submittedPhone);
    }
  }, [submittedPhone, otpForm]);

  // Handlers
  const handleBackClick = () => {
    if (currentStep === "otpInput") {
      setCurrentStep("phoneInput");
      setSubmittedPhone("");
      otpForm.reset();
      phoneForm.resetField("phone");
      setTimer(30);
      setResendAvailable(false);
    }
  };

  const onSubmitPhone = (data: z.infer<typeof phoneSchema>) => {
    sendOtpMutation.mutate(
      { phone: data.phone, intent: "signin" },
      {
        onSuccess: () => {
          setSubmittedPhone(data.phone);
          setTimer(30);
          setResendAvailable(false);
          setCurrentStep("otpInput");
        }
      }
    );
  };

  const onSubmitOtp = (data: z.infer<typeof otpSchema>) => {
    signInPhoneMutation.mutate(
      { phone: data.phone, otp: data.otp },
      {
        onSuccess: (response: any) => {
          try {
            const roles = response?.data?.roles ?? [];

            if (roles.length > 0) {
              setUserRoles(roles);
              setCurrentStep("signInComplete");
              toast.success(`Welcome back!`);
            } else {
              toast.warning("Sign-in succeeded, but no roles were returned.");
            }
          } catch (err) {
            toast.error("Something went wrong processing login response.");
          }
        },

        onError: (error: any) => {
          toast.error(error?.message || "OTP verification failed. Please try again.");
        },
      }
    );
  };


  const handleResendOtp = () => {
    if (submittedPhone) {
      console.log("Resend OTP for:", submittedPhone);
      sendOtpMutation.mutate(
        { phone: submittedPhone, intent: "signin" },
        {
          onSuccess: () => {
            setTimer(30);
            setResendAvailable(false);
            otpForm.resetField("otp");
          }
        }
      );
    }
  };

  const handleBuySellClick = () => {
    // Using non-null assertion since this is set at build time in Coolify
    const MARKETPLACE_BASE = process.env.NEXT_PUBLIC_MARKETPLACE_URL!;
    window.location.href = `${MARKETPLACE_BASE}/posts`;
  };

  const handleDriverJobsClick = () => {
    // Using non-null assertion since this is set at build time in Coolify
    const DRIVERJOBS_BASE = process.env.NEXT_PUBLIC_DRIVERJOBS_BASE_URL!;
    window.location.href = `${DRIVERJOBS_BASE}/driver-jobs`;
  };

  const phoneValue = phoneForm.watch("phone");
  const isPhoneValidForButton = Boolean(phoneValue && phoneValue.replace('+91', '').length === 10);

  const otpValue = otpForm.watch("otp");
  const isOtpValidForButton = Boolean(otpValue && otpValue.length === 6);

  const showBackButtonAsLink = currentStep === "phoneInput";
  const showRegularBackButton = currentStep === "otpInput" || currentStep === "signInComplete";

  return (
    <div className="container mx-auto px-4 py-4 sm:py-6 lg:py-10 flex flex-col bg-gray-50 min-h-screen">
      {currentStep !== "signInComplete" && (
        <BackButton
          isOtpStep={showRegularBackButton}
          onBackClick={handleBackClick}
          homeHref="/"
          buttonText={showBackButtonAsLink ? "Back to Home" : "Back"}
        />
      )}

      <div className="flex flex-col flex-1 items-center mt-4 sm:mt-5">
        {currentStep !== "signInComplete" && (
          <Header
            title={
              currentStep === "phoneInput"
                ? "Welcome Back"
                : "Enter OTP"
            }
            subtitle={
              currentStep === "phoneInput"
                ? "Sign in to your Drova account to continue your logistics journey."
                : `We've sent a 6-digit code to ${submittedPhone}`
            }
            customClassName="max-w-xl px-4 md:px-6"
          />
        )}

        <div className="w-full max-w-md sm:max-w-lg lg:max-w-xl flex flex-col items-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.3 }}
              className="w-full"
            >
              {currentStep === "phoneInput" ? (
                <div className="my-4 sm:my-6">
                  <PhoneInputCard
                    control={phoneForm.control}
                    onSubmit={phoneForm.handleSubmit(onSubmitPhone)}
                    errors={phoneForm.formState.errors}
                    isPending={sendOtpMutation.isPending}
                    isPhoneValid={isPhoneValidForButton}
                    phoneValue={phoneValue}
                    onPhoneChange={(value) => phoneForm.setValue("phone", value, { shouldValidate: true })}
                    disclaimer={<>* By continuing, you agree to our <a href="/terms" className="underline">Terms of Service</a> and <a href="/privacy" className="underline">Privacy Policy</a></>}
                    customStyle=""
                    label="Phone Login"
                  />
                </div>
              ) : currentStep === "otpInput" ? (
                <EnterOtpCard
                  control={otpForm.control}
                  onSubmit={otpForm.handleSubmit(onSubmitOtp)}
                  errors={otpForm.formState.errors}
                  isVerifyingOtp={signInPhoneMutation.isPending}
                  isOtpValid={isOtpValidForButton}
                  submittedPhone={submittedPhone}
                  timer={timer}
                  resendAvailable={resendAvailable}
                  onResendOtp={handleResendOtp}
                  onChangePhoneNumber={handleBackClick}
                  otpValue={otpValue}
                  onOtpChange={(value) => otpForm.setValue("otp", value, { shouldValidate: true })}
                />
              ) : currentStep === "signInComplete" ? (
                <SignInCompleteCard
                  userName={submittedPhone.replace('+91', '')}
                  userPhone={submittedPhone}
                  roles={userRoles}
                  onBuySellClick={handleBuySellClick}
                  onDriverJobsClick={handleDriverJobsClick}
                />
              ) : null}
            </motion.div>
          </AnimatePresence>

          {currentStep === "phoneInput" && (
            <div className="text-center mt-3 sm:mt-4 w-full">
              <p className="text-gray-700 text-sm sm:text-base">
                Don't have an account?{" "}
                <Link href="/signup" className="underline text-primary hover:text-primary/80 font-medium">
                  Sign Up Now
                </Link>
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
