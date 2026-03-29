"use client";

import { CheckCircle } from "lucide-react";
import React from "react";

export function ApplicationSubmitted() {
  return (
    <div className="flex flex-col items-center justify-center text-center py-24 max-w-md  mx-auto  bg-white rounded-xl shadow-sm space-y-10">
      {/* Success Icon */}
      <div className="mb-8">
        <div className="w-20 h-20 bg-[#FFCF51]/10 rounded-full flex items-center justify-center">
          <CheckCircle className="w-12 h-12 text-[#FFCF51]" />
        </div>
      </div>

      {/* Success Message */}
      <div className="space-y-4">
        <h2 className="text-xl sm:text-2xl font-semibold text-textdark">
          Application Submitted
        </h2>
<div className="">
        <p className="text-base sm:text-lg text-textdark max-w-md px-10">
          We've received your
        </p>
        <p className="text-base sm:text-lg text-textdark max-w-md px-10">
          application and will be in touch soon.
        </p>
        </div>
      </div>
    </div>
  );
}
