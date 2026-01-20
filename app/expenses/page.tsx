import { getExpenses } from '@/lib/actions/expenses';
import { getProjects } from '@/lib/actions/projects';
import { getTeamMembers } from '@/lib/actions/team';
import ExpenseForm from '@/components/ExpenseForm';
import { format } from 'date-fns';
import DeleteExpenseButton from '@/components/DeleteExpenseButton';
import { formatCurrency } from '@/lib/utils/currency';

export const dynamic = 'force-dynamic';

interface ExpensesPageProps {
  searchParams: { month?: string; year?: string; projectId?: string };
}

export default async function ExpensesPage({ searchParams }: ExpensesPageProps) {
  const now = new Date();
  const month = searchParams.month ? parseInt(searchParams.month) : now.getMonth() + 1;
  const year = searchParams.year ? parseInt(searchParams.year) : now.getFullYear();
  const projectId = searchParams.projectId;

  // Optimize: Fetch data in parallel
  const [expensesResult, projectsResult, teamResult] = await Promise.all([
    getExpenses(month, year, projectId),
    getProjects(),
    getTeamMembers(),
  ]);
  const expenses = expensesResult.success ? expensesResult.expenses : [];
  const projects = projectsResult.success ? projectsResult.projects : [];
  const teamMembers = teamResult.success ? teamResult.teamMembers : [];

  const getExpenseTypeLabel = (type: string) => {
    switch (type) {
      case 'team':
        return 'Team Payout';
      case 'tools':
        return 'Tools/Subscription';
      case 'misc':
        return 'Miscellaneous';
      default:
        return type;
    }
  };

  return (
    <div className="p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-text-light dark:text-text-dark">Expenses</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Track project expenses and team payouts</p>
          <div className="mt-3 p-3 bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-lg">
            <p className="text-sm text-purple-800 dark:text-purple-200">
              <strong>👥 To pay team members:</strong> Select "Team Payout" → Choose the team member → Enter amount → Add description → Click "Add Expense"
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <div className="bg-card-light dark:bg-card-dark rounded-lg shadow-sm p-6 border border-gray-200 dark:border-gray-700 sticky top-4">
              <h2 className="text-lg font-semibold text-text-light dark:text-text-dark mb-4">Add Expense</h2>
              <ExpenseForm month={month} year={year} projects={projects} teamMembers={teamMembers} />
            </div>
          </div>

          <div className="lg:col-span-2">
            <div className="bg-card-light dark:bg-card-dark rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                <h2 className="text-lg font-semibold text-text-light dark:text-text-dark">
                  Expenses - {format(new Date(year, month - 1, 1), 'MMMM yyyy')}
                </h2>
              </div>

              {expenses.length === 0 ? (
                <div className="p-12 text-center">
                  <p className="text-gray-500 dark:text-gray-400">No expenses recorded for this month</p>
                </div>
              ) : (
                <div className="divide-y divide-gray-200 dark:divide-gray-700">
                  {/* Mobile: Cards */}
                  <div className="md:hidden">
                    {expenses.map((expense: any) => (
                      <ExpenseCard key={expense._id} expense={expense} getExpenseTypeLabel={getExpenseTypeLabel} />
                    ))}
                  </div>

                  {/* Desktop: Table */}
                  <div className="hidden md:block overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50 dark:bg-gray-800">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                            Project
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                            Type
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                            Description
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                            Amount
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                            Date
                          </th>
                          <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-card-light dark:bg-card-dark divide-y divide-gray-200 dark:divide-gray-700">
                        {expenses.map((expense: any) => (
                          <tr key={expense._id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm font-medium text-text-light dark:text-text-dark">
                                {expense.projectId?.name || 'Unknown'}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className="text-sm text-gray-600 dark:text-gray-400">
                                {getExpenseTypeLabel(expense.type)}
                              </span>
                              {expense.teamMemberId && (
                                <div className="text-xs text-gray-500 dark:text-gray-400">
                                  {expense.teamMemberId.name}
                                </div>
                              )}
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                              {expense.description}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className="text-sm font-semibold text-red-600 dark:text-red-400">
                                {formatCurrency(expense.amount, expense.projectId?.currency || 'USD')}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                              {format(new Date(expense.date || expense.dateIncurred), 'MMM dd, yyyy')}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                              <DeleteExpenseButton expenseId={expense._id} />
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ExpenseCard({ expense, getExpenseTypeLabel }: { expense: any; getExpenseTypeLabel: (type: string) => string }) {
  return (
    <div className="p-4">
      <div className="flex justify-between items-start mb-2">
        <div>
          <h3 className="font-semibold text-text-light dark:text-text-dark">{expense.projectId?.name || 'Unknown'}</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">{getExpenseTypeLabel(expense.type)}</p>
          {expense.teamMemberId && (
            <p className="text-xs text-gray-400 dark:text-gray-500">{expense.teamMemberId.name}</p>
          )}
        </div>
        <span className="text-lg font-semibold text-red-600 dark:text-red-400">
          {formatCurrency(expense.amount, expense.projectId?.currency || 'USD')}
        </span>
      </div>
      <div className="flex justify-between items-center text-sm text-gray-500 dark:text-gray-400">
        <span>{expense.description}</span>
        <DeleteExpenseButton expenseId={expense._id} />
      </div>
      <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
        {format(new Date(expense.date || expense.dateIncurred), 'MMM dd, yyyy')}
      </p>
    </div>
  );
}
