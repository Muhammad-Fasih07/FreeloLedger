'use client';

import { useState } from 'react';
import { inviteUser, updateUserRole } from '@/lib/actions/company';
import { useSession } from 'next-auth/react';
import ThemeToggle from './ThemeToggle';
import { showToast } from '@/components/Toast';

interface User {
  _id: string;
  name: string;
  email: string;
  role: 'admin' | 'manager' | 'member';
  createdAt: string;
}

interface SettingsContentProps {
  currentUser: any;
  users: User[];
}

export default function SettingsContent({ currentUser, users }: SettingsContentProps) {
  const { data: session } = useSession() as any;
  const [isInviting, setIsInviting] = useState(false);
  const [inviteForm, setInviteForm] = useState({ email: '', role: 'member' as 'admin' | 'manager' | 'member' });
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const isAdmin = currentUser?.role === 'admin';

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setIsInviting(true);

    const formData = new FormData();
    formData.append('email', inviteForm.email);
    formData.append('role', inviteForm.role);

    const result = await inviteUser(formData);
    
    if (result.success) {
      const message = result.message || 'User invited successfully';
      setSuccess(message);
      showToast(message, 'success');
      setInviteForm({ email: '', role: 'member' });
      
      // Show temp password if email wasn't sent
      if ((result as any).tempPassword && !(result as any).emailSent) {
        setTimeout(() => {
          alert(`Email sending failed. Please share these login credentials manually:\n\nEmail: ${inviteForm.email}\nPassword: ${(result as any).tempPassword}\n\n⚠️ Tell them to change password after first login!`);
        }, 500);
      }
      
      // Refresh page to show new user
      setTimeout(() => window.location.reload(), 1500);
    } else {
      const errorMsg = result.error || 'Failed to invite user';
      setError(errorMsg);
      showToast(errorMsg, 'error');
    }
    
    setIsInviting(false);
  };

  const handleRoleChange = async (userId: string, newRole: 'admin' | 'manager' | 'member') => {
    setError(null);
    setSuccess(null);

    const result = await updateUserRole(userId, newRole);
    
    if (result.success) {
      setSuccess('User role updated successfully');
      window.location.reload();
    } else {
      setError(result.error || 'Failed to update user role');
    }
  };

  const getRoleLabel = (role: string) => {
    const roleMap: Record<string, string> = {
      admin: 'Admin',
      manager: 'Manager',
      member: 'Member',
    };
    return roleMap[role] || role;
  };

  return (
    <div className="space-y-6">
      {/* Theme Settings */}
      <div className="bg-card-light dark:bg-card-dark rounded-lg shadow-sm p-6 border border-gray-200 dark:border-gray-700">
        <h2 className="text-lg font-semibold text-text-light dark:text-text-dark mb-4">Theme</h2>
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-600 dark:text-gray-400">Switch between light and dark mode</p>
          <ThemeToggle />
        </div>
      </div>

      {/* Company Users */}
      <div className="bg-card-light dark:bg-card-dark rounded-lg shadow-sm p-6 border border-gray-200 dark:border-gray-700">
        <h2 className="text-lg font-semibold text-text-light dark:text-text-dark mb-4">Team Members</h2>
        
        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-4">
            <p className="text-red-800 dark:text-red-200 text-sm">{error}</p>
          </div>
        )}

        {success && (
          <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4 mb-4">
            <p className="text-green-800 dark:text-green-200 text-sm">{success}</p>
          </div>
        )}

        {isAdmin && (
          <form onSubmit={handleInvite} className="mb-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <h3 className="text-sm font-medium text-text-light dark:text-text-dark mb-3">Invite New Member</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  required
                  value={inviteForm.email}
                  onChange={(e) => setInviteForm({ ...inviteForm, email: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-text-light dark:text-text-dark focus:ring-2 focus:ring-primary focus:border-primary"
                  placeholder="user@example.com"
                />
              </div>
              <div>
                <label htmlFor="role" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Role
                </label>
                <select
                  id="role"
                  value={inviteForm.role}
                  onChange={(e) => setInviteForm({ ...inviteForm, role: e.target.value as any })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-text-light dark:text-text-dark focus:ring-2 focus:ring-primary focus:border-primary"
                >
                  <option value="member">Member</option>
                  <option value="manager">Manager</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              <div className="flex items-end">
                <button
                  type="submit"
                  disabled={isInviting}
                  className="w-full px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isInviting ? 'Inviting...' : 'Invite'}
                </button>
              </div>
            </div>
          </form>
        )}

        <div className="space-y-2">
          {users.map((user) => (
            <div
              key={user._id}
              className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg"
            >
              <div className="flex-1">
                <p className="font-medium text-text-light dark:text-text-dark">{user.name}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">{user.email}</p>
              </div>
              <div className="flex items-center gap-4">
                {isAdmin ? (
                  <select
                    value={user.role}
                    onChange={(e) => handleRoleChange(user._id, e.target.value as any)}
                    className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-text-light dark:text-text-dark focus:ring-2 focus:ring-primary focus:border-primary"
                  >
                    <option value="member">Member</option>
                    <option value="manager">Manager</option>
                    <option value="admin">Admin</option>
                  </select>
                ) : (
                  <span className="px-3 py-1 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg text-sm">
                    {getRoleLabel(user.role)}
                  </span>
                )}
                {user._id === currentUser?.id && (
                  <span className="text-xs text-gray-500 dark:text-gray-400">(You)</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
