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
  if (user.role !== 'team_lead') {
    redirect('/dashboard');
  }
  return user;
}

export function canEdit(userRole: 'team_lead' | 'senior_member'): boolean {
  return userRole === 'team_lead';
}
