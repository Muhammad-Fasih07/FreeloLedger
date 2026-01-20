import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';

export async function getCurrentUser() {
  const session = await getServerSession(authOptions);
  return session?.user || null;
}

export async function requireAuth() {
  const user = await getCurrentUser();
  if (!user) {
    redirect('/login');
  }
  return user;
}

export async function requireTeamLead() {
  const user = await requireAuth();
  // Admin has full access (equivalent to old team_lead)
  if ((user as any).role !== 'admin') {
    redirect('/dashboard');
  }
  return user;
}

export function canEdit(userRole: 'admin' | 'manager' | 'member'): boolean {
  // Admin and manager can edit, member cannot
  return userRole === 'admin' || userRole === 'manager';
}
