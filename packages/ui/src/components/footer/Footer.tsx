"use client";

import Image from "next/image";
import Link from "next/link";
import logo from "../../../assets/images/drova-logo.png";

export interface FooterLinkItem {
  label: string;
  href: string;
}

export interface FooterSection {
  title: string;
  links: FooterLinkItem[];
}

export interface FooterProps {
  footerSections: FooterSection[];
  companyName?: string;
}

const Footer = ({
  footerSections,
  companyName = "Drova",
}: FooterProps) => {
  return (
    <footer className="bg-white py-12 text-sm">
      <div className="container mx-auto px-6 md:px-16">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-8 mb-10">
          {footerSections.map((section) => (
            <div key={section.title}>
              <h3 className="font-semibold text-gray-800 mb-3">
                {section.title}
              </h3>
              <ul className="space-y-2">
                {section.links.map((linkItem) => (
                  <li key={linkItem.href}>
                    <Link
                      href={linkItem.href}
                      className="text-gray-500 hover:text-gray-800 transition-colors duration-200"
                    >
                      {linkItem.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <hr className="border-gray-200 my-8" />
        <div className="flex flex-col sm:flex-row justify-between items-center text-center sm:text-left">
          <div className="mb-4 sm:mb-0">
            <Link href={"/"} className="text-2xl font-bold text-indigo-600">
              <Image src={logo} alt="drova" width={100} height={100} />
            </Link>
          </div>
          <p className="text-gray-500 text-xs">
            © {new Date().getFullYear()} {companyName}. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export { Footer };
