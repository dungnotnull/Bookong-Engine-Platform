import React from 'react';
import { HostSidebar } from '@/components/host/host-sidebar';

export default function HostLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex bg-[#F5F7FA] min-h-[calc(100vh-60px)]">
      <HostSidebar />
      <div className="flex-1 p-6 md:p-8 overflow-x-hidden">{children}</div>
    </div>
  );
}
