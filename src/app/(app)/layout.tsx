import { MainLayout } from "@/components/layout/main-layout";
import { FinancialReportProvider } from "@/contexts/financial-report-provider";
import { WealthProvider } from "@/contexts/wealth-provider";
import { AppProvider } from "@/contexts/app-provider";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <AppProvider>
      <WealthProvider>
        <FinancialReportProvider>
          <MainLayout>{children}</MainLayout>
        </FinancialReportProvider>
      </WealthProvider>
    </AppProvider>
  );
}
