import React from 'react';
import { HostHeader } from '@/components/host/host-header';
import { HostSidebar } from '@/components/host/host-sidebar';

export default function HostLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#F5F7FA] flex flex-col">
      <HostHeader />
      <div className="flex flex-1">
        <HostSidebar />
        <main className="flex-1 p-6 md:p-8 overflow-x-hidden">{children}</main>
      </div>
    </div>
  );
}
