import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { getCompanyUsers, inviteUser, updateUserRole } from '@/lib/actions/company';
import SettingsContent from '@/components/SettingsContent';

export const dynamic = 'force-dynamic';

export default async function SettingsPage() {
  const session = await getServerSession(authOptions) as any;
  const usersResult = await getCompanyUsers();
  const users = usersResult.success ? usersResult.users : [];

  return (
    <div className="p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-text-light dark:text-text-dark">Settings</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Manage your company and team members</p>
        </div>

        <SettingsContent 
          currentUser={session?.user}
          users={users}
        />
      </div>
    </div>
  );
}
