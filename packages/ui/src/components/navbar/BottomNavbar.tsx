"use client";

import { LucideIcon } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@repo/ui/lib/utils";

interface NavItem {
  href: string;
  icon: LucideIcon;
  label: string;
  // If true (or when href is absolute), navigate with a full page load
  external?: boolean;
}

interface BottomNavbarProps {
  navItems: NavItem[];
}

export function BottomNavbar({ navItems }: BottomNavbarProps) {
  const pathname = usePathname();

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50 pb-5 pt-1">
      <div className="flex justify-around items-center h-16">
        {navItems.map((item) => {
          const isAbsolute = /^https?:\/\//i.test(item.href);
          const isExternal = item.external || isAbsolute;
          const isActive = !isExternal && pathname.startsWith(item.href);

          const common = (
            <>
              <item.icon className={cn("h-6 w-6 mb-1", isActive && "text-primary")} />
              <span className={cn("text-xs", isActive && "text-primary font-semibold")}>{item.label}</span>
            </>
          );

          return isExternal ? (
            <a
              href={item.href}
              key={item.label}
              className="flex flex-col items-center justify-center text-gray-500 hover:text-primary"
            >
              {common}
            </a>
          ) : (
            <Link
              href={item.href}
              key={item.label}
              prefetch={false}
              className="flex flex-col items-center justify-center text-gray-500 hover:text-primary"
            >
              {common}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

// Export the NavItem type for use in other components
export type { NavItem };
