"use client";

import { cn } from "@repo/ui/lib/utils";
import { NavLinkItem } from "./NavBar"; // Import type

interface NavLinksProps {
  links: NavLinkItem[];
  activeLinkKey: string;
  onNavLinkClick: (href: string, key: string) => void;
}

export const NavLinks = (props: NavLinksProps) => {
  const { links, activeLinkKey, onNavLinkClick } = props;

  return (
    <nav className="flex flex-col md:flex-row gap-1 md:gap-4 lg:gap-6">
      {links.map((item) => (
        <button
          key={item.key}
          className={cn(
            "text-base transition-colors duration-200 text-left px-3 py-2 md:px-2 md:py-1 rounded-md md:rounded-none hover:bg-gray-50 md:hover:bg-transparent",
            "!text-base !font-medium !leading-6", // Force override with !important
            activeLinkKey === item.key // Compare with item.key for active state
              ? "!font-semibold text-textdark"
              : "text-textdark/40 hover:text-textdark"
          )}
          style={{
            fontSize: '16px',
            fontWeight: activeLinkKey === item.key ? '600' : '500',
            lineHeight: '1.5rem',
            fontFamily: 'inherit'
          }}
          onClick={() => {
            if (item.onClick) {
              item.onClick(item.key);
            } else {
              onNavLinkClick(item.href, item.key);
            }
          }}
        >
          {item.label}
        </button>
      ))}
    </nav>
  );
};
