import Link from 'next/link';
import { getProjectDetails } from '@/lib/actions/dashboard';
import { format } from 'date-fns';
import { CurrencyDollarIcon, UserGroupIcon, CalendarIcon } from '@heroicons/react/24/outline';

interface EnhancedProjectCardProps {
  project: any;
  currentMonth: number;
  currentYear: number;
}

export default async function EnhancedProjectCard({ project, currentMonth, currentYear }: EnhancedProjectCardProps) {
  try {
    // Ensure project._id is a string
    const projectId = typeof project._id === 'object' ? project._id.toString() : project._id;
    const detailsResult = await getProjectDetails(projectId, currentMonth, currentYear);
    
    if (!detailsResult.success || !detailsResult.data) {
      console.error('Failed to load project details:', { 
        projectId, 
        error: detailsResult.error,
        success: detailsResult.success 
      });
      // Return a minimal card instead of null so projects still show
      return (
        <Link
          href={`/projects/${projectId}`}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-200 dark:border-gray-700 p-4 block hover:shadow-lg transition-shadow"
        >
          <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-2">{project.name}</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{project.clientName}</p>
          <p className="text-xs text-red-500 dark:text-red-400">
            Unable to load details: {detailsResult.error || 'Unknown error'}
          </p>
        </Link>
      );
    }

    const data = detailsResult.data; // TypeScript now knows data is defined
    const currency = project.currency || 'USD';
  
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const monthlyReceived = data.payments
    .filter((p: any) => p.month === currentMonth && p.year === currentYear)
    .reduce((sum: number, p: any) => sum + p.amount, 0);

  const monthlyExpenses = data.expenses
    .filter((e: any) => e.month === currentMonth && e.year === currentYear)
    .reduce((sum: number, e: any) => sum + e.amount, 0);

  const monthlyTeamPayouts = data.expenses
    .filter((e: any) => e.month === currentMonth && e.year === currentYear && e.type === 'team')
    .reduce((sum: number, e: any) => sum + e.amount, 0);

  const progress = project.totalBudget > 0 
    ? (data.totalReceived / project.totalBudget) * 100 
    : 0;

  return (
    <Link
      href={`/projects/${projectId}`}
      className="group bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all duration-300 block overflow-hidden transform hover:scale-[1.01]"
    >
      {/* Header - Compact */}
      <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-4 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full blur-2xl -mr-12 -mt-12"></div>
        <div className="relative z-10">
          <div className="flex items-start justify-between gap-2 mb-2">
            <div className="flex-1 min-w-0">
              <h3 className="text-lg font-bold text-white mb-1 truncate">{project.name}</h3>
              <p className="text-sm text-blue-100 flex items-center gap-1 truncate">
                <CurrencyDollarIcon className="w-3.5 h-3.5 flex-shrink-0" />
                <span className="truncate">{project.clientName}</span>
              </p>
            </div>
            <span className="px-2 py-1 text-xs font-semibold bg-white/20 backdrop-blur-sm text-white rounded-md flex-shrink-0">
              {currency}
            </span>
          </div>
        </div>
      </div>

      {/* Main Content - Better Spacing */}
      <div className="p-4 space-y-4">
        {/* Budget & Progress - Compact */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs font-medium text-gray-600 dark:text-gray-400">Total Budget</span>
            <span className="text-base font-bold text-gray-900 dark:text-gray-100">
              {formatCurrency(project.totalBudget || 0)}
            </span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mb-1.5 overflow-hidden">
            <div
              className="bg-gradient-to-r from-blue-500 to-indigo-600 h-2 rounded-full transition-all duration-500"
              style={{ width: `${Math.min(progress, 100)}%` }}
            />
          </div>
          <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
            <span>{progress.toFixed(0)}% Complete</span>
            <span className="truncate ml-2">{formatCurrency(data.remaining)} Remaining</span>
          </div>
        </div>

        {/* Financial Summary - Tighter Grid */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-3 border border-green-200 dark:border-green-800">
            <p className="text-xs font-semibold text-green-700 dark:text-green-300 mb-1">Total Received</p>
            <p className="text-lg font-bold text-green-700 dark:text-green-400 truncate">
              {formatCurrency(data.totalReceived)}
            </p>
          </div>
          <div className="bg-red-50 dark:bg-red-900/20 rounded-lg p-3 border border-red-200 dark:border-red-800">
            <p className="text-xs font-semibold text-red-700 dark:text-red-300 mb-1">Total Expenses</p>
            <p className="text-lg font-bold text-red-700 dark:text-red-400 truncate">
              {formatCurrency(data.totalExpenses)}
            </p>
          </div>
        </div>

        {/* Monthly Breakdown - Compact */}
        <div className="bg-gray-50 dark:bg-gray-900/50 rounded-lg p-3">
          <div className="flex items-center gap-1.5 mb-2.5">
            <CalendarIcon className="w-3.5 h-3.5 text-gray-500 dark:text-gray-400" />
            <h4 className="text-xs font-semibold text-gray-700 dark:text-gray-300">
              {format(new Date(currentYear, currentMonth - 1, 1), 'MMMM yyyy')}
            </h4>
          </div>
          <div className="space-y-1.5">
            <div className="flex justify-between items-center text-xs">
              <span className="text-gray-600 dark:text-gray-400">Received:</span>
              <span className="font-semibold text-green-600 dark:text-green-400">
                {formatCurrency(monthlyReceived)}
              </span>
            </div>
            <div className="flex justify-between items-center text-xs">
              <span className="text-gray-600 dark:text-gray-400">Expenses:</span>
              <span className="font-semibold text-red-600 dark:text-red-400">
                {formatCurrency(monthlyExpenses)}
              </span>
            </div>
            <div className="flex justify-between items-center text-xs pt-1.5 border-t border-gray-200 dark:border-gray-700">
              <span className="font-medium text-gray-700 dark:text-gray-300">Net:</span>
              <span className={`font-bold ${(monthlyReceived - monthlyExpenses) >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                {formatCurrency(monthlyReceived - monthlyExpenses)}
              </span>
            </div>
          </div>
        </div>

        {/* Expense Breakdown by Type */}
        {data.expenses && data.expenses.length > 0 && (
          <div>
            <h4 className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2">Expense Breakdown</h4>
            <div className="space-y-1.5">
              {(() => {
                const expenseByType = data.expenses.reduce((acc: any, exp: any) => {
                  const type = exp.type || 'misc';
                  if (!acc[type]) acc[type] = 0;
                  acc[type] += exp.amount;
                  return acc;
                }, {});
                
                const typeLabels: { [key: string]: string } = {
                  team: 'Team Payouts',
                  tools: 'Tools & Software',
                  misc: 'Miscellaneous'
                };
                
                const expenseTypes = Object.entries(expenseByType);
                return expenseTypes.slice(0, 3).map(([type, amount]: [string, any]) => (
                  <div key={type} className="flex justify-between items-center text-xs bg-white dark:bg-gray-800 rounded-md px-2 py-1.5 border border-gray-200 dark:border-gray-700">
                    <span className="text-gray-600 dark:text-gray-400">{typeLabels[type] || type.charAt(0).toUpperCase() + type.slice(1)}</span>
                    <span className="font-medium text-red-600 dark:text-red-400">{formatCurrency(amount)}</span>
                  </div>
                ));
              })()}
              {(() => {
                const expenseTypes = data.expenses.reduce((acc: any, exp: any) => {
                  const type = exp.type || 'misc';
                  acc[type] = true;
                  return acc;
                }, {});
                const typeCount = Object.keys(expenseTypes).length;
                return typeCount > 3 && (
                  <p className="text-xs text-gray-500 dark:text-gray-400 text-center pt-1">
                    +{typeCount - 3} more expense type{typeCount - 3 !== 1 ? 's' : ''}
                  </p>
                );
              })()}
            </div>
          </div>
        )}

        {/* Team Payouts - Compact */}
        {data.teamPayouts && data.teamPayouts.length > 0 && (
          <div>
            <div className="flex items-center gap-1.5 mb-2">
              <UserGroupIcon className="w-3.5 h-3.5 text-gray-500 dark:text-gray-400" />
              <h4 className="text-xs font-semibold text-gray-700 dark:text-gray-300">Team Members Paid</h4>
            </div>
            <div className="space-y-1.5">
              {data.teamPayouts.slice(0, 2).map((tp: any) => (
                <div key={tp.teamMemberId} className="flex justify-between items-center text-xs bg-white dark:bg-gray-800 rounded-md p-2 border border-gray-200 dark:border-gray-700">
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-gray-900 dark:text-gray-100 truncate">{tp.name}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{tp.role}</p>
                  </div>
                  <div className="text-right ml-2 flex-shrink-0">
                    <p className="font-semibold text-gray-900 dark:text-gray-100">
                      {formatCurrency(tp.totalPaid)}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {tp.paymentCount} payment{tp.paymentCount !== 1 ? 's' : ''}
                    </p>
                  </div>
                </div>
              ))}
              {data.teamPayouts.length > 2 && (
                <p className="text-xs text-gray-500 dark:text-gray-400 text-center pt-1">
                  +{data.teamPayouts.length - 2} more
                </p>
              )}
            </div>
          </div>
        )}

        {/* Payment History - Compact Scrollable */}
        {data.monthlyBreakdown && data.monthlyBreakdown.length > 0 && (
          <div>
            <h4 className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2">Payment History</h4>
            <div className="space-y-1 max-h-24 overflow-y-auto pr-1">
              {data.monthlyBreakdown.slice(-4).reverse().map((mb: any) => {
                // Safety check for data structure
                if (!mb) return null;
                const year = mb.year || (mb._id && mb._id.year);
                const month = mb.month || (mb._id && mb._id.month);
                const total = mb.total || 0;
                
                if (!year || !month) return null;
                
                return (
                  <div key={`${year}-${month}`} className="flex justify-between items-center text-xs bg-white dark:bg-gray-800 rounded-md px-2 py-1.5 border border-gray-200 dark:border-gray-700">
                    <span className="text-gray-600 dark:text-gray-400">
                      {format(new Date(year, month - 1, 1), 'MMM yyyy')}
                    </span>
                    <span className="font-medium text-green-600 dark:text-green-400">
                      {formatCurrency(total)}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Net Profit - Footer */}
        <div className="pt-3 border-t border-gray-200 dark:border-gray-700">
          <div className="flex justify-between items-center">
            <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">Net Profit</span>
            <span className={`text-lg font-bold ${data.netProfit >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
              {formatCurrency(data.netProfit)}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
  } catch (error: any) {
    console.error('Error rendering project card:', error);
    return null;
  }
}
