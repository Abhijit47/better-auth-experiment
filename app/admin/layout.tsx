import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import AppHeader from './_components/app-header';
import { AppSidebar } from './_components/app-sidebar';

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <AppHeader />

        <div className='flex flex-1 flex-col gap-4 p-4 pt-0'>{children}</div>
      </SidebarInset>
    </SidebarProvider>
  );
}
