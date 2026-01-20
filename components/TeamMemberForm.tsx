'use client';

import { useRouter } from 'next/navigation';
import { useState, useRef } from 'react';
import { useSession } from 'next-auth/react';
import { createTeamMember, updateTeamMember } from '@/lib/actions/team';

interface TeamMemberFormProps {
  teamMember?: any;
}

export default function TeamMemberForm({ teamMember }: TeamMemberFormProps) {
  const router = useRouter();
  const { data: session } = useSession();
  const formRef = useRef<HTMLFormElement>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [payoutType, setPayoutType] = useState<'fixed' | 'percentage'>(
    teamMember?.payoutType || 'fixed'
  );
  const [formData, setFormData] = useState({
    name: teamMember?.name || '',
    role: teamMember?.role || '',
    payoutAmount: teamMember?.payoutAmount || '',
    payoutPercentage: teamMember?.payoutPercentage || '',
  });
  
  const role = (session?.user as any)?.role;
  const canEdit = role === 'admin' || role === 'manager';
  
  if (!canEdit) {
    return (
      <div className="text-center py-8 text-gray-500 dark:text-gray-400">
        <p className="text-sm">Only admins and managers can manage team members</p>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    formData.set('payoutType', payoutType);

    try {
      const result = teamMember
        ? await updateTeamMember(teamMember._id, formData)
        : await createTeamMember(formData);

      if (result.success) {
        if (teamMember) {
          router.push('/team');
          router.refresh();
        } else {
          // Reset form safely
          if (formRef.current) {
            formRef.current.reset();
          }
          setPayoutType('fixed');
          setFormData({
            name: '',
            role: '',
            payoutAmount: '',
            payoutPercentage: '',
          });
          router.refresh();
        }
      } else {
        setError(result.error || 'An error occurred');
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form ref={formRef} onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3">
          <p className="text-red-800 dark:text-red-200 text-sm">{error}</p>
        </div>
      )}

      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Name *
        </label>
        <input
          type="text"
          id="name"
          name="name"
          required
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-text-light dark:text-text-dark focus:ring-2 focus:ring-primary focus:border-primary"
          placeholder="Team member name"
        />
      </div>

      <div>
        <label htmlFor="role" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Role *
        </label>
        <input
          type="text"
          id="role"
          name="role"
          required
          value={formData.role}
          onChange={(e) => setFormData({ ...formData, role: e.target.value })}
          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-text-light dark:text-text-dark focus:ring-2 focus:ring-primary focus:border-primary"
          placeholder="e.g., Developer, Designer"
        />
      </div>

      <div>
        <label htmlFor="payoutType" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Payout Type *
        </label>
        <select
          id="payoutType"
          name="payoutType"
          required
          value={payoutType}
          onChange={(e) => setPayoutType(e.target.value as 'fixed' | 'percentage')}
          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-text-light dark:text-text-dark focus:ring-2 focus:ring-primary focus:border-primary"
        >
          <option value="fixed">Fixed Amount</option>
          <option value="percentage">Percentage</option>
        </select>
      </div>

      {payoutType === 'fixed' ? (
        <div>
          <label htmlFor="payoutAmount" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Fixed Amount ($) *
          </label>
          <input
            type="number"
            id="payoutAmount"
            name="payoutAmount"
            required={payoutType === 'fixed'}
            min="0"
            step="0.01"
            value={formData.payoutAmount}
            onChange={(e) => setFormData({ ...formData, payoutAmount: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-text-light dark:text-text-dark focus:ring-2 focus:ring-primary focus:border-primary"
            placeholder="0.00"
          />
        </div>
      ) : (
        <div>
          <label
            htmlFor="payoutPercentage"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
          >
            Percentage (%) *
          </label>
          <input
            type="number"
            id="payoutPercentage"
            name="payoutPercentage"
            required={payoutType === 'percentage'}
            min="0"
            max="100"
            step="0.01"
            value={formData.payoutPercentage}
            onChange={(e) => setFormData({ ...formData, payoutPercentage: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-text-light dark:text-text-dark focus:ring-2 focus:ring-primary focus:border-primary"
            placeholder="0.00"
          />
        </div>
      )}

      <div className="flex gap-4">
        <button
          type="submit"
          disabled={isSubmitting}
          className="flex-1 px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting
            ? 'Saving...'
            : teamMember
            ? 'Update Team Member'
            : 'Add Team Member'}
        </button>
        {teamMember && (
          <button
            type="button"
            onClick={() => router.back()}
            className="px-6 py-3 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors font-medium"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}
