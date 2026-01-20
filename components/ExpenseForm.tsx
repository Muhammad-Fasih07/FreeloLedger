'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { createExpense } from '@/lib/actions/expenses';

interface ExpenseFormProps {
  month: number;
  year: number;
  projects: any[];
  teamMembers: any[];
}

export default function ExpenseForm({ month, year, projects, teamMembers }: ExpenseFormProps) {
  const router = useRouter();
  const { data: session } = useSession();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [expenseType, setExpenseType] = useState<string>('misc');
  
  const role = (session?.user as any)?.role;
  const canEdit = role === 'admin' || role === 'manager';
  
  if (!canEdit) {
    return (
      <div className="text-center py-8 text-gray-500 dark:text-gray-400">
        <p className="text-sm">Only admins and managers can add expenses</p>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    // Date will be used to auto-compute month/year in the server action
    const dateValue = formData.get('date') as string;
    if (dateValue) {
      const date = new Date(dateValue);
      formData.set('month', String(date.getMonth() + 1));
      formData.set('year', String(date.getFullYear()));
    }
    formData.set('type', expenseType);

    // Only include teamMemberId if it's a team expense
    if (expenseType !== 'team') {
      formData.delete('teamMemberId');
    }

    try {
      const result = await createExpense(formData);

      if (result.success) {
        e.currentTarget.reset();
        setExpenseType('misc');
        router.refresh();
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
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3">
          <p className="text-red-800 dark:text-red-200 text-sm">{error}</p>
        </div>
      )}

      <div>
        <label htmlFor="projectId" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Project *
        </label>
        <select
          id="projectId"
          name="projectId"
          required
          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-text-light dark:text-text-dark focus:ring-2 focus:ring-primary focus:border-primary"
        >
          <option value="">Select a project</option>
          {projects.map((project) => (
            <option key={project._id} value={project._id}>
              {project.name} - {project.clientName}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="type" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Expense Type *
        </label>
        <select
          id="type"
          name="type"
          required
          value={expenseType}
          onChange={(e) => setExpenseType(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-text-light dark:text-text-dark focus:ring-2 focus:ring-primary focus:border-primary"
        >
          <option value="misc">Miscellaneous</option>
          <option value="tools">Tools/Subscription</option>
          <option value="team">Team Payout</option>
        </select>
      </div>

      {expenseType === 'team' && (
        <div>
          <label htmlFor="teamMemberId" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Team Member (Who you're paying) *
          </label>
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">Select the team member you're paying</p>
          <select
            id="teamMemberId"
            name="teamMemberId"
            required
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-text-light dark:text-text-dark focus:ring-2 focus:ring-primary focus:border-primary"
          >
            <option value="">Select a team member</option>
            {teamMembers.map((member) => (
              <option key={member._id} value={member._id}>
                {member.name} - {member.role}
              </option>
            ))}
          </select>
        </div>
      )}

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Description *
        </label>
        <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
          {expenseType === 'team' ? 'e.g., "January 2026 salary" or "Monthly payment"' : 'Describe what this expense is for'}
        </p>
        <input
          type="text"
          id="description"
          name="description"
          required
          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-text-light dark:text-text-dark focus:ring-2 focus:ring-primary focus:border-primary"
          placeholder="Expense description"
        />
      </div>

      <div>
        <label htmlFor="amount" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Amount Paid ($) *
        </label>
        <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
          {expenseType === 'team' ? 'Enter how much you paid to this team member' : 'Enter the expense amount'}
        </p>
        <input
          type="number"
          id="amount"
          name="amount"
          required
          min="0"
          step="0.01"
          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-text-light dark:text-text-dark focus:ring-2 focus:ring-primary focus:border-primary"
          placeholder="0.00"
        />
      </div>

      <div>
        <label htmlFor="date" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Date *
        </label>
        <input
          type="date"
          id="date"
          name="date"
          required
          defaultValue={new Date().toISOString().split('T')[0]}
          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-text-light dark:text-text-dark focus:ring-2 focus:ring-primary focus:border-primary"
        />
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isSubmitting ? 'Adding...' : 'Add Expense'}
      </button>
    </form>
  );
}
