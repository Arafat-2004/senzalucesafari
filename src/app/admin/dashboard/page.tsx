import { requirePageAdmin } from "@/lib/admin-auth"
import { redirect } from 'next/navigation';

export default async function AdminDashboardRedirect() {
  await requirePageAdmin();
  redirect('/admin');
}
