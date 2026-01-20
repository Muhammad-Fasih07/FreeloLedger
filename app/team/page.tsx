import { getTeamMembers } from '@/lib/actions/team';
import TeamMemberForm from '@/components/TeamMemberForm';
import { PencilIcon } from '@heroicons/react/24/outline';
import DeleteTeamMemberButton from '@/components/DeleteTeamMemberButton';
import Link from 'next/link';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export default async function TeamPage() {
  const session: any = await getServerSession(authOptions);
  const canEdit = session?.user?.role === 'admin' || session?.user?.role === 'manager';
  const result = await getTeamMembers();

  if (!result.success) {
    return (
      <div className="p-6">
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
          <p className="text-red-800 dark:text-red-200">Error loading team members: {result.error}</p>
        </div>
      </div>
    );
  }

  const teamMembers = result.teamMembers || [];

  return (
    <div className="p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-text-light dark:text-text-dark">Team Members</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Add and manage your team members</p>
          <div className="mt-3 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
            <p className="text-sm text-blue-800 dark:text-blue-200">
              <strong>💡 Tip:</strong> Add team members here first. Then when you pay them, go to <strong>Expenses</strong> page and select "Team Payout" to record the payment.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {canEdit && (
            <div className="lg:col-span-1">
              <div className="bg-card-light dark:bg-card-dark rounded-lg shadow-sm p-6 border border-gray-200 dark:border-gray-700 sticky top-4">
                <h2 className="text-lg font-semibold text-text-light dark:text-text-dark mb-4">Add Team Member</h2>
                <TeamMemberForm />
              </div>
            </div>
          )}

          <div className={canEdit ? 'lg:col-span-2' : 'lg:col-span-full'}>
            {teamMembers.length === 0 ? (
              <div className="bg-card-light dark:bg-card-dark rounded-lg shadow-sm p-12 border border-gray-200 dark:border-gray-700 text-center">
                <p className="text-gray-600 dark:text-gray-400 mb-4">No team members yet</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {canEdit ? 'Add team members to track payouts and expenses' : 'No team members available'}
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {teamMembers.map((member: any) => (
                  <div
                    key={member._id}
                    className="bg-card-light dark:bg-card-dark rounded-lg shadow-sm p-6 border border-gray-200 dark:border-gray-700"
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-text-light dark:text-text-dark">{member.name}</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{member.role}</p>
                        <div className="mt-3">
                          <span className="inline-block px-3 py-1 text-xs font-medium bg-primary/10 text-primary dark:bg-primary/20 dark:text-primary rounded-full">
                            {member.payoutType === 'fixed' ? 'Fixed Amount' : 'Percentage'}
                          </span>
                          <span className="ml-2 text-sm font-medium text-text-light dark:text-text-dark">
                            {member.payoutType === 'fixed' ? (
                              <>${member.payoutAmount?.toLocaleString() || 0}</>
                            ) : (
                              <>{member.payoutPercentage || 0}%</>
                            )}
                          </span>
                        </div>
                      </div>
                      {canEdit && (
                        <div className="flex gap-2">
                          <Link
                            href={`/team/${member._id}`}
                            className="p-2 text-gray-600 dark:text-gray-400 hover:text-primary transition-colors"
                          >
                            <PencilIcon className="w-5 h-5" />
                          </Link>
                          <DeleteTeamMemberButton teamMemberId={member._id} />
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
