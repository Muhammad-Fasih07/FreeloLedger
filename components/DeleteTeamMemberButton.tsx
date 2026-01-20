'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { deleteTeamMember } from '@/lib/actions/team';
import { TrashIcon } from '@heroicons/react/24/outline';

export default function DeleteTeamMemberButton({ teamMemberId }: { teamMemberId: string }) {
  const router = useRouter();
  const { data: session } = useSession();
  const [isDeleting, setIsDeleting] = useState(false);
  
  const role = (session?.user as any)?.role;
  const canEdit = role === 'admin' || role === 'manager';
  
  if (!canEdit) {
    return null;
  }

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this team member?')) {
      return;
    }

    setIsDeleting(true);
    try {
      const result = await deleteTeamMember(teamMemberId);
      if (result.success) {
        router.refresh();
      } else {
        alert('Error deleting team member: ' + result.error);
      }
    } catch (error: any) {
      alert('Error deleting team member: ' + error.message);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <button
      onClick={handleDelete}
      disabled={isDeleting}
      className="p-2 text-gray-600 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors disabled:opacity-50"
      aria-label="Delete team member"
    >
      <TrashIcon className="w-5 h-5" />
    </button>
  );
}
