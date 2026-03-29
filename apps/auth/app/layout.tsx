import { Footer } from "@repo/ui/components/footer/Footer";
import "@repo/ui/globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import type { FooterSection } from "@repo/ui/components/footer/Footer";
import ReactQueryProvider from "@repo/ui/providers/QueryClientProvider";
import { Toaster } from "sonner";
import AuthNavBarClient from "./components/AuthNavBarClient";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Drova Auth",
  description: "Secure authentication for Drova platform",
};

const MARKETPLACE_BASE = process.env.NEXT_PUBLIC_MARKETPLACE_URL;

const authFooterSections: FooterSection[] = [
  {
    title: "Home",
    links: [
      { label: "My favorites", href: `${MARKETPLACE_BASE}/my-favorites` },
      { label: "Recents", href: `${MARKETPLACE_BASE}/recents` },
    ],
  },
  {
    title: "Buy & Sell",
    links: [
      { label: "Buy Vehicle", href: `${MARKETPLACE_BASE}/buy-vehicle` },
      { label: "Sell Vehicle", href: `${MARKETPLACE_BASE}/sell-vehicle` },
    ],
  },
  { title: "Hiring", links: [{ label: "Jobs", href: `${MARKETPLACE_BASE}/jobs` }] },
  {
    title: "Company",
    links: [
      { label: "Terms & Conditions", href: "/legal/terms" },
      { label: "Privacy Policy", href: "/legal/privacy" },
      { label: "Legal Terms", href: "/legal/general-terms" },
      { label: "Marketplace Blog", href: `${MARKETPLACE_BASE}/blog` },
    ],
  },
];

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}): JSX.Element {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ReactQueryProvider>
          <AuthNavBarClient />
          <main className="bg-[#FAFAFB]">{children}</main>
          <Footer
            footerSections={authFooterSections}
            companyName="Marketplace Solutions Inc."
          />
        </ReactQueryProvider>
        <Toaster
          toastOptions={{
            classNames: {
              default:
                "bg-white text-slate-900 dark:bg-slate-900 dark:text-slate-50 z-50 p-4 shadow-lg backdrop-blur-md ",
              success:
                "bg-green-500 text-white z-50 p-4 shadow-lg backdrop-blur-md ",
              error:
                "bg-red-500 text-white z-50 p-4 shadow-lg backdrop-blur-md ",
              loading:
                "bg-blue-500 text-white z-50 p-4 shadow-lg backdrop-blur-md ",
            },
          }}
        />
      </body>
    </html>
  );
}
