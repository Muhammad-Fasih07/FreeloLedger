'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { deleteExpense } from '@/lib/actions/expenses';
import { TrashIcon } from '@heroicons/react/24/outline';

export default function DeleteExpenseButton({ expenseId }: { expenseId: string }) {
  const router = useRouter();
  const { data: session } = useSession();
  const [isDeleting, setIsDeleting] = useState(false);
  
  const role = (session?.user as any)?.role;
  const canEdit = role === 'admin' || role === 'manager';
  
  if (!canEdit) {
    return null;
  }

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this expense?')) {
      return;
    }

    setIsDeleting(true);
    try {
      const result = await deleteExpense(expenseId);
      if (result.success) {
        router.refresh();
      } else {
        alert('Error deleting expense: ' + result.error);
      }
    } catch (error: any) {
      alert('Error deleting expense: ' + error.message);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <button
      onClick={handleDelete}
      disabled={isDeleting}
      className="text-red-600 dark:text-red-400 hover:text-red-900 dark:hover:text-red-300 disabled:opacity-50 transition-colors"
      aria-label="Delete expense"
    >
      <TrashIcon className="w-5 h-5" />
    </button>
  );
}
