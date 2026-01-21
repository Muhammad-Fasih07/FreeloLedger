'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { deletePayment } from '@/lib/actions/payments';
import { TrashIcon } from '@heroicons/react/24/outline';
import { showToast } from '@/components/Toast';

export default function DeletePaymentButton({ paymentId }: { paymentId: string }) {
  const router = useRouter();
  const { data: session } = useSession();
  const [isDeleting, setIsDeleting] = useState(false);
  
  const role = (session?.user as any)?.role;
  const canEdit = role === 'admin' || role === 'manager';
  
  if (!canEdit) {
    return null;
  }

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this payment?')) {
      return;
    }

    setIsDeleting(true);
    try {
      const result = await deletePayment(paymentId);
      if (result.success) {
        showToast('Payment deleted successfully!', 'success');
        router.refresh();
      } else {
        const errorMsg = result.error || 'Failed to delete payment';
        showToast(errorMsg, 'error');
      }
    } catch (error: any) {
      const errorMsg = error.message || 'Failed to delete payment';
      showToast(errorMsg, 'error');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <button
      onClick={handleDelete}
      disabled={isDeleting}
      className="text-red-600 dark:text-red-400 hover:text-red-900 dark:hover:text-red-300 disabled:opacity-50 transition-colors"
      aria-label="Delete payment"
    >
      <TrashIcon className="w-5 h-5" />
    </button>
  );
}
