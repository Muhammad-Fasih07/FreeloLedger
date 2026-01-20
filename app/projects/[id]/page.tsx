import { notFound } from 'next/navigation';
import { getProject } from '@/lib/actions/projects';
import { getProjectTotalReceived } from '@/lib/actions/payments';
import { getPayments } from '@/lib/actions/payments';
import { getExpenses } from '@/lib/actions/expenses';
import ProjectForm from '@/components/ProjectForm';
import Link from 'next/link';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { format } from 'date-fns';
import { formatCurrency } from '@/lib/utils/currency';

export const dynamic = 'force-dynamic';

export default async function ProjectDetailPage({ params }: { params: { id: string } }) {
  const session: any = await getServerSession(authOptions);
  const canEdit = session?.user?.role === 'admin' || session?.user?.role === 'manager';
  const projectResult = await getProject(params.id);

  if (!projectResult.success || !projectResult.project) {
    notFound();
  }

  const project = projectResult.project;
  
  // Optimize: Fetch all project data in parallel
  const [paymentResult, paymentsResult, expensesResult] = await Promise.all([
    getProjectTotalReceived(params.id),
    getPayments(undefined, undefined, params.id),
    getExpenses(undefined, undefined, params.id),
  ]);
  
  const totalReceived = paymentResult.success ? paymentResult.total : 0;
  const payments = paymentsResult.success ? paymentsResult.payments : [];
  const expenses = expensesResult.success ? expensesResult.expenses : [];

  const totalExpenses = expenses.reduce((sum: number, exp: any) => sum + exp.amount, 0);
  const netProfit = totalReceived - totalExpenses;
  const currency = project.currency || 'USD';

  return (
    <div className="p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <Link
          href="/projects"
          className="inline-flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-text-light dark:hover:text-text-dark mb-6"
        >
          <ArrowLeftIcon className="w-5 h-5" />
          Back to Projects
        </Link>

        {canEdit && (
          <>
            <div className="mb-6">
              <h1 className="text-2xl md:text-3xl font-bold text-text-light dark:text-text-dark">Edit Project</h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">Update project details</p>
            </div>

            <div className="bg-card-light dark:bg-card-dark rounded-lg shadow-sm p-6 border border-gray-200 dark:border-gray-700 mb-6">
              <ProjectForm project={project} />
            </div>
          </>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-card-light dark:bg-card-dark rounded-lg shadow-sm p-4 border border-gray-200 dark:border-gray-700">
            <p className="text-sm text-gray-600 dark:text-gray-400">Total Received</p>
            <p className="text-2xl font-bold text-secondary mt-1">
              {formatCurrency(totalReceived, currency)}
            </p>
          </div>
          <div className="bg-card-light dark:bg-card-dark rounded-lg shadow-sm p-4 border border-gray-200 dark:border-gray-700">
            <p className="text-sm text-gray-600 dark:text-gray-400">Total Expenses</p>
            <p className="text-2xl font-bold text-red-600 dark:text-red-400 mt-1">
              {formatCurrency(totalExpenses, currency)}
            </p>
          </div>
          <div className="bg-card-light dark:bg-card-dark rounded-lg shadow-sm p-4 border border-gray-200 dark:border-gray-700">
            <p className="text-sm text-gray-600 dark:text-gray-400">Net Profit</p>
            <p className={`text-2xl font-bold mt-1 ${netProfit >= 0 ? 'text-secondary' : 'text-red-600 dark:text-red-400'}`}>
              {formatCurrency(netProfit, currency)}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-card-light dark:bg-card-dark rounded-lg shadow-sm p-6 border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-text-light dark:text-text-dark mb-4">Recent Payments</h3>
            {payments.length === 0 ? (
              <p className="text-gray-500 dark:text-gray-400 text-sm">No payments recorded</p>
            ) : (
              <div className="space-y-3">
                {payments.slice(0, 5).map((payment: any) => (
                  <div key={payment._id} className="flex justify-between items-center py-2 border-b border-gray-100 dark:border-gray-700 last:border-0">
                    <div>
                      <p className="font-medium text-text-light dark:text-text-dark">
                        {formatCurrency(payment.amount, currency)}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {format(new Date(payment.date || payment.dateReceived), 'MMM dd, yyyy')}
                      </p>
                    </div>
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      {format(new Date(payment.year, payment.month - 1), 'MMM yyyy')}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="bg-card-light dark:bg-card-dark rounded-lg shadow-sm p-6 border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-text-light dark:text-text-dark mb-4">Recent Expenses</h3>
            {expenses.length === 0 ? (
              <p className="text-gray-500 dark:text-gray-400 text-sm">No expenses recorded</p>
            ) : (
              <div className="space-y-3">
                {expenses.slice(0, 5).map((expense: any) => (
                  <div key={expense._id} className="flex justify-between items-center py-2 border-b border-gray-100 dark:border-gray-700 last:border-0">
                    <div>
                      <p className="font-medium text-text-light dark:text-text-dark">{expense.description}</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {format(new Date(expense.date || expense.dateIncurred), 'MMM dd, yyyy')}
                      </p>
                    </div>
                    <span className="font-medium text-red-600 dark:text-red-400">
                      {formatCurrency(expense.amount, currency)}
                    </span>
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
