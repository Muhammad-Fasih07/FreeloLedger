import Link from 'next/link';
import { getProjectTotalReceived } from '@/lib/actions/payments';
import { getExpenses } from '@/lib/actions/expenses';
import { formatCurrency } from '@/lib/utils/currency';

interface ProjectSummaryCardProps {
  project: any;
}

export default async function ProjectSummaryCard({ project }: ProjectSummaryCardProps) {
  const paymentResult = await getProjectTotalReceived(project._id);
  const totalReceived = paymentResult.success ? paymentResult.total : 0;

  const expensesResult = await getExpenses(undefined, undefined, project._id);
  const expenses = expensesResult.success ? expensesResult.expenses : [];
  const totalExpenses = expenses.reduce((sum: number, exp: any) => sum + exp.amount, 0);

  const totalBudget = project.totalBudget || project.expectedTotalAmount || 0;
  const remaining = totalBudget - totalReceived;
  const netProfit = totalReceived - totalExpenses;
  const progress = totalBudget > 0 
    ? (totalReceived / totalBudget) * 100 
    : 0;

  const currency = project.currency || 'USD';

  return (
    <Link
      href={`/projects/${project._id}`}
      className="bg-card-light dark:bg-card-dark rounded-lg shadow-sm p-6 border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow block"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-text-light dark:text-text-dark mb-1">{project.name}</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">{project.clientName}</p>
        </div>
        <span className="text-xs text-gray-500 dark:text-gray-400">
          {new Date(project.startDate).toLocaleDateString('en-US', {
            month: 'short',
            year: 'numeric',
          })}
        </span>
      </div>

      <div className="space-y-3 mb-4">
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600 dark:text-gray-400">Total Budget:</span>
          <span className="font-semibold text-text-light dark:text-text-dark">{formatCurrency(totalBudget, currency)}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600 dark:text-gray-400">Total Received:</span>
          <span className="font-semibold text-secondary">{formatCurrency(totalReceived, currency)}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600 dark:text-gray-400">Total Expenses:</span>
          <span className="font-semibold text-red-600 dark:text-red-400">{formatCurrency(totalExpenses, currency)}</span>
        </div>
        <div className="flex justify-between items-center pt-2 border-t border-gray-200 dark:border-gray-700">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Net Profit:</span>
          <span className={`font-bold text-lg ${netProfit >= 0 ? 'text-secondary' : 'text-red-600 dark:text-red-400'}`}>
            {formatCurrency(netProfit, currency)}
          </span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600 dark:text-gray-400">Remaining Budget:</span>
          <span className={`font-semibold ${remaining > 0 ? 'text-accent' : 'text-text-light dark:text-text-dark'}`}>
            {formatCurrency(remaining, currency)}
          </span>
        </div>
      </div>

      <div className="mt-4">
        <div className="flex justify-between items-center mb-1">
          <span className="text-xs text-gray-500 dark:text-gray-400">Progress</span>
          <span className="text-xs font-medium text-gray-700 dark:text-gray-300">{progress.toFixed(0)}%</span>
        </div>
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
          <div
            className="bg-primary h-2 rounded-full transition-all"
            style={{ width: `${Math.min(progress, 100)}%` }}
          />
        </div>
      </div>
    </Link>
  );
}
