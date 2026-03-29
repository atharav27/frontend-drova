"use client";

import React, { useState, useEffect } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

// API hooks (local to Auth app)
import { useSendOtp, useVerifyOtpOnly, useRegisterUser } from "~/hooks/useAuthMutations";

// Components
import BackButton from "@repo/ui/components/login/BackButton";
import Header from "@repo/ui/components/login/Header";
import PhoneInputCard from "@repo/ui/components/login/PhoneInputCard";
import EnterOtpCard from "@repo/ui/components/login/EnterOtpCard";
import SignupStepper from "@repo/ui/components/signup/SignupStepper";
import ChooseRoleCard from "@repo/ui/components/signup/ChooseRoleCard";
import DriverDetailsFormCard, {
  driverDetailsSchema,
  buyerDetailsSchema,
  sellerDetailsSchema,
} from "@repo/ui/components/signup/DriverDetailsFormCard";
import RegistrationCompleteCard from "@repo/ui/components/signup/RegistrationCompleteCard";

const STEPS = [
  { id: 1, label: "Verification" },
  { id: 2, label: "Role" },
  { id: 3, label: "Details" },
  { id: 4, label: "Complete" },
];

const phoneSchema = z.object({
  phone: z.string().min(12, "Please enter a valid phone number (e.g., +91XXXXXXXXXX)").regex(/^\+91\d{10}$/, "Must be a valid Indian phone number (+91XXXXXXXXXX)"),
});

const otpSchema = z.object({
  otp: z.string().length(6, "OTP must be 6 digits"),
  phone: z.string(),
});

export default function SignupPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [verificationSubStep, setVerificationSubStep] = useState<"phoneInput" | "otpInput">("phoneInput");
  const [submittedPhone, setSubmittedPhone] = useState<string>("");
  const [selectedRole, setSelectedRole] = useState<string | null>(null);
  const [finalUserData, setFinalUserData] = useState<{
    name: string,
    phone: string,
    city?: string,
    role?: string
  }>({ name: "", phone: "" });

  // Timer and OTP resend states
  const [timer, setTimer] = useState(30);
  const [resendAvailable, setResendAvailable] = useState<boolean>(false);

  // API hooks
  const sendOtpMutation = useSendOtp();
  const verifyOtpOnlyMutation = useVerifyOtpOnly();
  const registerUserMutation = useRegisterUser();

  // Form instances
  const phoneForm = useForm<z.infer<typeof phoneSchema>>({
    resolver: zodResolver(phoneSchema),
    defaultValues: { phone: "" },
  });

  const otpForm = useForm<z.infer<typeof otpSchema>>({
    resolver: zodResolver(otpSchema),
    defaultValues: { otp: "", phone: "" },
  });

  const driverDetailsForm = useForm({
    resolver: zodResolver(driverDetailsSchema),
  });

  const buyerDetailsForm = useForm({
    resolver: zodResolver(buyerDetailsSchema),
  });

  const sellerDetailsForm = useForm({
    resolver: zodResolver(sellerDetailsSchema),
  });

  // Effects
  useEffect(() => {
    if (currentStep === STEPS[0]!.id && verificationSubStep === "otpInput" && submittedPhone) {
      if (timer === 0) {
        setResendAvailable(true);
        return;
      }
      const intervalId = setInterval(() => setTimer((t) => t - 1), 1000);
      return () => clearInterval(intervalId);
    }
  }, [currentStep, verificationSubStep, timer, submittedPhone]);

  useEffect(() => {
    if (submittedPhone) {
      otpForm.setValue("phone", submittedPhone);
    }
  }, [submittedPhone, otpForm]);

  // Debug: Monitor finalUserData changes
  useEffect(() => {
    console.log("🔄 finalUserData changed:", finalUserData);
  }, [finalUserData]);

  // Navigation handlers
  const handleNextStep = () => {
    if (currentStep < STEPS.length) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handlePrevStep = () => {
    if (currentStep === STEPS[0]!.id && verificationSubStep === "otpInput") {
      setVerificationSubStep("phoneInput");
      setSubmittedPhone("");
      otpForm.reset();
      phoneForm.resetField("phone");
      setTimer(30);
      setResendAvailable(false);
    } else if (currentStep > STEPS[0]!.id) {
      if (currentStep === STEPS[1]!.id) {
        setCurrentStep(STEPS[0]!.id);
        setVerificationSubStep("otpInput");
      } else {
        setCurrentStep(prev => prev - 1);
      }
    }
  };

  // Submission handlers
  const onSubmitPhone = (data: z.infer<typeof phoneSchema>) => {
    console.log("Phone submitted:", data.phone);

    sendOtpMutation.mutate(
      { phone: data.phone, intent: "register" },
      {
        onSuccess: (response) => {
          console.log("OTP sent successfully:", response);
          setSubmittedPhone(data.phone);
          setFinalUserData(prev => ({ ...prev, phone: data.phone }));
          setTimer(30);
          setResendAvailable(false);
          setVerificationSubStep("otpInput");
        }
      }
    );
  };

  const onSubmitOtpHandler = (data: z.infer<typeof otpSchema>) => {
    console.log("OTP submitted:", data.otp);

    verifyOtpOnlyMutation.mutate(
      { phone: data.phone, otp: data.otp },
      {
        onSuccess: (response) => {
          console.log("OTP verified successfully:", response);
          handleNextStep();
        },
        onError: (error) => {
          console.error("OTP verification failed:", error);
        }
      }
    );
  };

  const onRoleContinue = () => {
    if (selectedRole) {
      setCurrentStep(STEPS.find(s => s.label === "Details")!.id);
    }
  };

  const onSubmitDetails = (data: any) => {
    console.log("Details submitted:", data);

    // Determine documentType and prepare payload
    let documentType = "";
    let registrationPayload: any = {
      phone: submittedPhone,
      fullName: data.fullName,
      city: data.city,
    };

    // Logic based on role and form data
    if (data.drivingLicenseNumber && selectedRole === "driver") {
      documentType = "DRIVING_LICENSE";
      registrationPayload = {
        ...registrationPayload,
        documentType,
        dateOfBirth: data.dob ? data.dob.toISOString().split('T')[0] : "",
        licenseNumber: data.drivingLicenseNumber,
        licenseCategory: data.licenseCategory,
        licenseFrontImage: "drova.jpg"
      };
    } else if (data.panNumber && data.aadhaarNumber && selectedRole === "seller") {
      documentType = "PAN_CARD";
      registrationPayload = {
        ...registrationPayload,
        documentType,
        panNumber: data.panNumber,
        panCardImage: "drova.jpg",
        aadhaarNumber: data.aadhaarNumber,
        aadhaarCardImage: "drova.jpg"
      };
    } else if (data.aadhaarNumber && selectedRole === "buyer") {
      documentType = "AADHAAR";
      registrationPayload = {
        ...registrationPayload,
        documentType,
        aadhaarNumber: data.aadhaarNumber,
        aadhaarCardImage: "drova.jpg"
      };
    } else {
      // Fallback based on role
      if (selectedRole === "driver") documentType = "DRIVING_LICENSE";
      else if (selectedRole === "seller") documentType = "PAN_CARD";
      else if (selectedRole === "buyer") documentType = "AADHAAR";
      registrationPayload.documentType = documentType;
    }

    // Clean payload
    Object.keys(registrationPayload).forEach(key => {
      if (registrationPayload[key] === undefined || registrationPayload[key] === '') {
        delete registrationPayload[key];
      }
    });

    console.log("Final registration payload:", registrationPayload);

    // Register user
    registerUserMutation.mutate(
      registrationPayload,
      {
        onSuccess: (response) => {
          console.log("Registration successful:", response);
          console.log("response.data:", response.data);

          const userRole = response.data?.role;

          console.log("Extracted userRole:", userRole);

          const newUserData = {
            ...finalUserData,
            name: data.fullName,
            city: data.city,
            role: userRole
          };

          console.log("Setting finalUserData to:", newUserData);
          setFinalUserData(newUserData);

          handleNextStep();
        },
        onError: (error) => {
          console.error("Registration failed:", error);
        }
      }
    );
  };

  const onGoToDashboard = () => {
    const userRole = finalUserData.role;

    if (!userRole) {
      console.error("No user role found, redirecting to home");
      window.location.href = "/";
      return;
    }
      // Redirect based on role (using same method as navbar)
  const MARKETPLACE_BASE = process.env.NEXT_PUBLIC_MARKETPLACE_URL;
  if (userRole === "DRIVER") {
    // Driver goes to driverjobs app
    window.location.href = "http://localhost:3004/driver-jobs";
  } else if (userRole === "BUYER" || userRole === "SELLER") {
    // Buyer/Seller goes to marketplace app
    window.location.href = `${MARKETPLACE_BASE}/posts`;
  } else {
    // Unknown role, redirect to home
    window.location.href = "/";
  }
  };

  const handleResendOtp = () => {
    if (submittedPhone) {
      console.log("Resend OTP for:", submittedPhone);
      sendOtpMutation.mutate(
        { phone: submittedPhone, intent: "register" },
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

  const phoneValue = phoneForm.watch("phone");
  const isPhoneValidForButton = Boolean(phoneValue && phoneValue.replace('+91', '').length === 10);

  const otpValue = otpForm.watch("otp");
  const isOtpValidForButton = Boolean(otpValue && otpValue.length === 6);

  // Render step content
  const renderStepContent = () => {
    if (currentStep === STEPS[0]!.id) {
      if (verificationSubStep === "phoneInput") {
        return (
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
              label="Phone Verification"
            />
          </div>
        );
      } else if (verificationSubStep === "otpInput") {
        return (
          <EnterOtpCard
            control={otpForm.control}
            onSubmit={otpForm.handleSubmit(onSubmitOtpHandler)}
            errors={otpForm.formState.errors}
            isVerifyingOtp={verifyOtpOnlyMutation.isPending}
            isOtpValid={isOtpValidForButton}
            submittedPhone={submittedPhone}
            timer={timer}
            resendAvailable={resendAvailable}
            onResendOtp={handleResendOtp}
            onChangePhoneNumber={handlePrevStep}
            otpValue={otpValue}
            onOtpChange={(value) => otpForm.setValue("otp", value, { shouldValidate: true })}
          />
        );
      }
    }

    switch (currentStep) {
      case STEPS.find(s => s.label === "Role")!.id:
        return (
          <ChooseRoleCard
            selectedRole={selectedRole}
            onRoleSelect={setSelectedRole}
            onContinue={onRoleContinue}
          />
        );
      case STEPS.find(s => s.label === "Details")!.id:
        if (selectedRole === "buyer") {
          return (
            <FormProvider {...buyerDetailsForm}>
              <DriverDetailsFormCard
                role="buyer"
                control={buyerDetailsForm.control}
                onSubmit={buyerDetailsForm.handleSubmit(onSubmitDetails)}
                errors={buyerDetailsForm.formState.errors}
                isPending={registerUserMutation.isPending}
              />
            </FormProvider>
          );
        } else if (selectedRole === "seller") {
          return (
            <FormProvider {...sellerDetailsForm}>
              <DriverDetailsFormCard
                role="seller"
                control={sellerDetailsForm.control}
                onSubmit={sellerDetailsForm.handleSubmit(onSubmitDetails)}
                errors={sellerDetailsForm.formState.errors}
                isPending={registerUserMutation.isPending}
              />
            </FormProvider>
          );
        }
        return (
          <FormProvider {...driverDetailsForm}>
            <DriverDetailsFormCard
              role="driver"
              control={driverDetailsForm.control}
              onSubmit={driverDetailsForm.handleSubmit(onSubmitDetails)}
              errors={driverDetailsForm.formState.errors}
              isPending={registerUserMutation.isPending}
            />
          </FormProvider>
        );
      case STEPS.find(s => s.label === "Complete")!.id:
        return (
          <RegistrationCompleteCard
            userName={finalUserData.name || "User"}
            userPhone={finalUserData.phone}
            userCity={finalUserData.city}
            onGoToDashboard={onGoToDashboard}
          />
        );
      default:
        return <p>Loading...</p>;
    }
  };

  const showBackButtonAsLink = currentStep === STEPS[0]!.id && verificationSubStep === 'phoneInput';
  const showRegularBackButton = (currentStep === STEPS[0]!.id && verificationSubStep === 'otpInput') || (currentStep > STEPS[0]!.id && currentStep < STEPS.length);

  return (
    <div className="container mx-auto px-4 py-4 sm:py-6 lg:py-10 flex flex-col bg-gray-50 min-h-screen">
      <BackButton
        isOtpStep={showRegularBackButton}
        onBackClick={handlePrevStep}
        homeHref="/"
        buttonText={showBackButtonAsLink ? "Back to Home" : "Back"}
      />

      <div className="flex flex-col flex-1 items-center mt-4 sm:mt-5">
        <Header
          title={"Create Your Account"}
          subtitle={"Join thousands of logistics professionals across India. Register based on your role to access personalized features."}
          customClassName="max-w-xl px-4 md:px-6"
        />

        {currentStep < STEPS.find(s => s.label === "Complete")!.id && (
          <SignupStepper currentStep={currentStep} steps={STEPS.map(s => s.label)} />
        )}

        <div className="w-full max-w-md sm:max-w-lg lg:max-w-xl flex flex-col items-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={`${currentStep}-${verificationSubStep}`}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.3 }}
              className="w-full"
            >
              {renderStepContent()}
            </motion.div>
          </AnimatePresence>

          {currentStep === 1 && verificationSubStep === "phoneInput" && (
            <div className="text-center mt-3 sm:mt-4 w-full">
              <p className="text-gray-700 text-sm sm:text-base">
                Already have an account?{" "}
                <Link href="/login" className="underline text-primary hover:text-primary/80 font-medium">
                  Login Now
                </Link>
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
