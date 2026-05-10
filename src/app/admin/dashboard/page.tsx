import { requireAdmin } from "@/lib/admin-auth"
import { redirect } from 'next/navigation';

export default async function AdminDashboardRedirect() {
  await requireAdmin();
  redirect('/admin');
}
