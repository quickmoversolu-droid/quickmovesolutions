import React from 'react';
import { getServerSession } from '@/lib/auth/session';
import { AdminShell } from '@/components/admin/AdminShell';

export default function AdminRootLayout({ children }: { children: React.ReactNode }) {
  const session = getServerSession();
  const activeRole = session?.role && session.role !== 'CUSTOMER' ? session.role : 'OWNER';

  return <AdminShell activeRole={activeRole}>{children}</AdminShell>;
}

