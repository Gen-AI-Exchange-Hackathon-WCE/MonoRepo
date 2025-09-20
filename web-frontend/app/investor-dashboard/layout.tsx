import { ReactNode } from "react";

interface InvestorDashboardLayoutProps {
  children: ReactNode;
}

export default function InvestorDashboardLayout({ children }: InvestorDashboardLayoutProps) {
  return (
    <div className="min-h-screen bg-background">
      {children}
    </div>
  );
}