import { notFound } from 'next/navigation';
import { getTeamMember } from '@/lib/actions/team';
import TeamMemberForm from '@/components/TeamMemberForm';
import Link from 'next/link';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export default async function TeamMemberDetailPage({ params }: { params: { id: string } }) {
  const session: any = await getServerSession(authOptions);
  const canEdit = session?.user?.role === 'admin' || session?.user?.role === 'manager';
  
  const result = await getTeamMember(params.id);

  if (!result.success || !result.teamMember) {
    notFound();
  }

  const teamMember = result.teamMember;

  if (!canEdit) {
    return (
      <div className="p-4 md:p-8">
        <div className="max-w-2xl mx-auto">
          <Link
            href="/team"
            className="inline-flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-text-light dark:hover:text-text-dark mb-6"
          >
            <ArrowLeftIcon className="w-5 h-5" />
            Back to Team
          </Link>
          <div className="bg-card-light dark:bg-card-dark rounded-lg shadow-sm p-6 border border-gray-200 dark:border-gray-700 text-center">
            <p className="text-gray-500 dark:text-gray-400">Only admins and managers can edit team members</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8">
      <div className="max-w-2xl mx-auto">
        <Link
          href="/team"
          className="inline-flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-text-light dark:hover:text-text-dark mb-6"
        >
          <ArrowLeftIcon className="w-5 h-5" />
          Back to Team
        </Link>

        <div className="mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-text-light dark:text-text-dark">Edit Team Member</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Update team member details</p>
        </div>

        <div className="bg-card-light dark:bg-card-dark rounded-lg shadow-sm p-6 border border-gray-200 dark:border-gray-700">
          <TeamMemberForm teamMember={teamMember} />
        </div>
      </div>
    </div>
  );
}
