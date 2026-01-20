import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';
import mongoose from 'mongoose';

export async function getCurrentUserId() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    redirect('/login');
  }
  return new mongoose.Types.ObjectId(session.user.id);
}

export async function getCurrentCompanyId() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.companyId) {
    throw new Error('No company associated with user');
  }
  return new mongoose.Types.ObjectId(session.user.companyId);
}

export async function getCurrentUserRole() {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    redirect('/login');
  }
  return session.user.role as 'admin' | 'manager' | 'member';
}

export async function requireRole(requiredRole: 'admin' | 'manager' | 'member') {
  const role = await getCurrentUserRole();
  const roleHierarchy: Record<string, number> = {
    member: 1,
    manager: 2,
    admin: 3,
  };
  
  if (roleHierarchy[role] < roleHierarchy[requiredRole]) {
    throw new Error(`Access denied. Requires ${requiredRole} role.`);
  }
  return role;
}

export async function requireAdmin() {
  return requireRole('admin');
}

export async function requireManager() {
  return requireRole('manager');
}
