
'use client';
import { MainLayout } from "@/components/layout/main-layout";
import { FinancialReportProvider } from "@/contexts/financial-report-provider";
import { WealthProvider } from "@/contexts/wealth-provider";
import { AppProvider } from "@/contexts/app-provider";
import { CareerProvider } from "@/contexts/career-provider";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <AppProvider>
      <WealthProvider>
        <FinancialReportProvider>
          <CareerProvider>
            <MainLayout>{children}</MainLayout>
          </CareerProvider>
        </FinancialReportProvider>
      </WealthProvider>
    </AppProvider>
  );
}
