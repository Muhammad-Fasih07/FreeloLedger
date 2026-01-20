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
  const detailsResult = await getProjectDetails(project._id, currentMonth, currentYear);
  
  if (!detailsResult.success || !detailsResult.data) {
    return null;
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
      href={`/projects/${project._id}`}
      className="group bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 hover:shadow-2xl transition-all duration-300 block overflow-hidden transform hover:scale-[1.02] card-hover"
    >
      {/* Header */}
      <div className="bg-gradient-to-br from-blue-500/10 via-indigo-500/10 to-purple-500/10 dark:from-blue-900/30 dark:via-indigo-900/30 dark:to-purple-900/30 p-6 border-b border-gray-200 dark:border-gray-700 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full blur-3xl -mr-16 -mt-16"></div>
        <div className="relative z-10">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <h3 className="text-xl font-bold text-text-light dark:text-text-dark mb-1">{project.name}</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-1">
              <CurrencyDollarIcon className="w-4 h-4" />
              {project.clientName}
            </p>
          </div>
          <span className="px-3 py-1 text-xs font-semibold bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-full shadow-md">
            {currency}
          </span>
        </div>
        
        {project.description && (
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-2 line-clamp-2">
            {project.description}
          </p>
        )}
        </div>
      </div>

      {/* Main Content */}
      <div className="p-6">
        {/* Budget & Progress */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Budget</span>
            <span className="text-lg font-bold text-text-light dark:text-text-dark">
              {formatCurrency(project.totalBudget || 0)}
            </span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 mb-2 overflow-hidden shadow-inner">
            <div
              className="bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 h-3 rounded-full transition-all duration-500 shadow-md"
              style={{ width: `${Math.min(progress, 100)}%` }}
            />
          </div>
          <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
            <span>{progress.toFixed(0)}% Complete</span>
            <span>{formatCurrency(data.remaining)} Remaining</span>
          </div>
        </div>

        {/* Financial Summary */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl p-4 border border-green-200 dark:border-green-800 shadow-sm hover:shadow-md transition-shadow">
            <p className="text-xs font-semibold text-green-700 dark:text-green-300 mb-2 uppercase tracking-wide">Total Received</p>
            <p className="text-xl font-bold text-green-700 dark:text-green-400">
              {formatCurrency(data.totalReceived)}
            </p>
          </div>
          <div className="bg-gradient-to-br from-red-50 to-rose-50 dark:from-red-900/20 dark:to-rose-900/20 rounded-xl p-4 border border-red-200 dark:border-red-800 shadow-sm hover:shadow-md transition-shadow">
            <p className="text-xs font-semibold text-red-700 dark:text-red-300 mb-2 uppercase tracking-wide">Total Expenses</p>
            <p className="text-xl font-bold text-red-700 dark:text-red-400">
              {formatCurrency(data.totalExpenses)}
            </p>
          </div>
        </div>

        {/* Monthly Breakdown */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-3">
            <CalendarIcon className="w-4 h-4 text-gray-500 dark:text-gray-400" />
            <h4 className="text-sm font-semibold text-text-light dark:text-text-dark">
              {format(new Date(currentYear, currentMonth - 1, 1), 'MMMM yyyy')}
            </h4>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-600 dark:text-gray-400">Received this month:</span>
              <span className="font-semibold text-green-600 dark:text-green-400">
                {formatCurrency(monthlyReceived)}
              </span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-600 dark:text-gray-400">Expenses this month:</span>
              <span className="font-semibold text-red-600 dark:text-red-400">
                {formatCurrency(monthlyExpenses)}
              </span>
            </div>
            <div className="flex justify-between items-center text-sm pt-2 border-t border-gray-200 dark:border-gray-700">
              <span className="font-medium text-gray-700 dark:text-gray-300">Net this month:</span>
              <span className={`font-bold ${(monthlyReceived - monthlyExpenses) >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                {formatCurrency(monthlyReceived - monthlyExpenses)}
              </span>
            </div>
          </div>
        </div>

        {/* Team Payouts */}
        {data.teamPayouts.length > 0 && (
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-3">
              <UserGroupIcon className="w-4 h-4 text-gray-500 dark:text-gray-400" />
              <h4 className="text-sm font-semibold text-text-light dark:text-text-dark">Team Payouts</h4>
            </div>
            <div className="space-y-2">
              {data.teamPayouts.map((tp: any) => (
                <div key={tp.teamMemberId} className="flex justify-between items-center text-sm bg-gray-50 dark:bg-gray-800 rounded-lg p-2">
                  <div>
                    <p className="font-medium text-text-light dark:text-text-dark">{tp.name}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{tp.role}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-text-light dark:text-text-dark">
                      {formatCurrency(tp.totalPaid)}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {tp.paymentCount} payment{tp.paymentCount !== 1 ? 's' : ''}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Monthly Breakdown Summary */}
        {data.monthlyBreakdown.length > 0 && (
          <div>
            <h4 className="text-sm font-semibold text-text-light dark:text-text-dark mb-3">Payment History</h4>
            <div className="space-y-1 max-h-32 overflow-y-auto">
              {data.monthlyBreakdown.slice(-6).reverse().map((mb: any) => (
                <div key={`${mb._id.year}-${mb._id.month}`} className="flex justify-between items-center text-xs bg-gray-50 dark:bg-gray-800 rounded px-2 py-1">
                  <span className="text-gray-600 dark:text-gray-400">
                    {format(new Date(mb._id.year, mb._id.month - 1, 1), 'MMM yyyy')}
                  </span>
                  <span className="font-medium text-green-600 dark:text-green-400">
                    {formatCurrency(mb.total)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Net Profit */}
        <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Net Profit:</span>
            <span className={`text-xl font-bold ${data.netProfit >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
              {formatCurrency(data.netProfit)}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
