import { ReactNode } from 'react';

export default function DriverJobsLayout({
  children,
}: {
  children: ReactNode;
}) {
  return <div className="bg-[#FAFAFB]">{children}</div>;
}
