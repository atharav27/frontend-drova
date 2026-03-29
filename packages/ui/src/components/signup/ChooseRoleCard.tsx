"use client";

import React from "react";
import { Button } from "@repo/ui/components/ui/button";
import { cn } from "@repo/ui/lib/utils";
import { ShoppingCart, Truck, Package } from "lucide-react";

interface RoleOption {
  id: string;
  label: string;
  description: string;
  icon: React.ElementType;
}

const roles: RoleOption[] = [
  {
    id: "driver",
    label: "Driver",
    description: "Add photos, description and explore new jobs.",
    icon: Truck,
  },
  {
    id: "buyer",
    label: "Buyer",
    description: "Browse products, contact sellers.",
    icon: ShoppingCart,
  },
  {
    id: "seller",
    label: "Seller",
    description: "Post listings, verify identity, track responses.",
    icon: Package,
  },
];

interface RoleOptionButtonProps {
  role: RoleOption;
  isSelected: boolean;
  onSelect: (roleId: string) => void;
}

function RoleSelectionIndicator({ isSelected }: { isSelected: boolean }) {
    if (isSelected) {
      return (
        <div className="flex h-6 w-6 items-center justify-center rounded-full border-2 border-[#5D74B7]">
          <div className="h-3 w-3 rounded-full bg-[#5D74B7]" />
        </div>
      );
    }
    return <div className="h-6 w-6 rounded-full border-2 border-[#5D74B7]/21" />;
  }


function RoleOptionButton({ role, isSelected, onSelect }: RoleOptionButtonProps) {
  const Icon = role.icon;
  return (
    <button
      type="button"
      onClick={() => onSelect(role.id)}
      className={cn(
        "w-full flex items-center text-left p-3 sm:p-4 border rounded-2xl transition-all",
        isSelected
          ? "border-[#5D74B714]/30 bg-[#5D74B714]/10"
          : "border-[#5D74B736]/21 bg-white hover:border-gray-300"
      )}
    >
      <div className="mr-3 sm:mr-4 flex h-10 w-10 sm:h-12 sm:w-12 shrink-0 items-center justify-center border border-[#5D74B724]/15 rounded-full bg-primary/5">
        <Icon className="h-6 w-6 sm:h-7 sm:w-7 text-[#5D74B7]" />
      </div>
      <div className="flex-grow">
        <p className="font-semibold text-base sm:text-xl text-[#4D619D]">{role.label}</p>
        <p className="text-sm sm:text-md text-[#4D619DCC]/80">{role.description}</p>
      </div>
      <div className="ml-auto pl-3">
        <RoleSelectionIndicator isSelected={isSelected} />
      </div>
    </button>
  );
}

interface ChooseRoleCardProps {
  selectedRole: string | null;
  onRoleSelect: (roleId: string) => void;
  onContinue: () => void;
  isPending?: boolean;
  className?: string;
}

export default function ChooseRoleCard({
  selectedRole,
  onRoleSelect,
  onContinue,
  isPending,
  className
}: ChooseRoleCardProps) {
  return (
    <div className={cn("bg-white shadow-sm rounded-lg p-6 md:p-14 mb-10", className)}>
      <div className="space-y-6 sm:space-y-9">
        <div>
          <h3 className="text-lg font-medium text-textdark sm:text-xl">
            Choose Your Role
          </h3>
          <p className="mt-1 text-textdark/70 text-md">
            Select your role to personalise your experience on Drova
          </p>
        </div>
<div className="space-y-5 sm:space-y-7">
        <div className="space-y-3">
            {roles.map((role) => (
                <RoleOptionButton
                key={role.id}
                role={role}
                isSelected={selectedRole === role.id}
                onSelect={onRoleSelect}
                />
            ))}
        </div>

        <Button
          type="button"
          onClick={onContinue}
          className="w-full h-12 bg-primary hover:bg-primary/90 text-white rounded-lg font-medium text-base"
          disabled={isPending || !selectedRole}
        >
          {isPending ? "Continuing..." : "Continue"}
        </Button>
        </div>
      </div>
    </div>
  );
}
