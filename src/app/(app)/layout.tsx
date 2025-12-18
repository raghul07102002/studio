import { MainLayout } from "@/components/layout/main-layout";
import { WealthProvider } from "@/contexts/wealth-provider";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <WealthProvider>
      <MainLayout>{children}</MainLayout>
    </WealthProvider>
  );
}
