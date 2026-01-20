import { CurrencyDollarIcon, ArrowTrendingUpIcon, ArrowTrendingDownIcon, FolderIcon } from '@heroicons/react/24/outline';

interface DashboardCardsProps {
  totalIncome: number;
  totalExpenses: number;
  netProfit: number;
  activeProjectsCount: number;
}

export default function DashboardCards({
  totalIncome,
  totalExpenses,
  netProfit,
  activeProjectsCount,
}: DashboardCardsProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
      {/* Total Income Card */}
      <div className="group bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-2xl shadow-lg hover:shadow-xl border border-green-200 dark:border-green-800 p-6 transition-all duration-300 transform hover:scale-105 card-hover">
        <div className="flex items-center justify-between mb-4">
          <div className="p-3 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl shadow-md group-hover:scale-110 transition-transform">
            <CurrencyDollarIcon className="w-6 h-6 text-white" />
          </div>
          <span className="text-xs font-semibold text-green-700 dark:text-green-300 bg-green-100 dark:bg-green-900/30 px-2 py-1 rounded-full">
            Income
          </span>
        </div>
        <div>
          <p className="text-sm font-medium text-green-700 dark:text-green-300 mb-1">Total Income</p>
          <p className="text-2xl md:text-3xl font-bold text-green-900 dark:text-green-100">
            {formatCurrency(totalIncome)}
          </p>
        </div>
      </div>

      {/* Total Expenses Card */}
      <div className="group bg-gradient-to-br from-red-50 to-rose-50 dark:from-red-900/20 dark:to-rose-900/20 rounded-2xl shadow-lg hover:shadow-xl border border-red-200 dark:border-red-800 p-6 transition-all duration-300 transform hover:scale-105 card-hover">
        <div className="flex items-center justify-between mb-4">
          <div className="p-3 bg-gradient-to-br from-red-500 to-rose-600 rounded-xl shadow-md group-hover:scale-110 transition-transform">
            <ArrowTrendingDownIcon className="w-6 h-6 text-white" />
          </div>
          <span className="text-xs font-semibold text-red-700 dark:text-red-300 bg-red-100 dark:bg-red-900/30 px-2 py-1 rounded-full">
            Expenses
          </span>
        </div>
        <div>
          <p className="text-sm font-medium text-red-700 dark:text-red-300 mb-1">Total Expenses</p>
          <p className="text-2xl md:text-3xl font-bold text-red-900 dark:text-red-100">
            {formatCurrency(totalExpenses)}
          </p>
        </div>
      </div>

      {/* Net Profit Card */}
      <div className={`group rounded-2xl shadow-lg hover:shadow-xl border p-6 transition-all duration-300 transform hover:scale-105 card-hover ${
        netProfit >= 0
          ? 'bg-gradient-to-br from-emerald-50 to-green-50 dark:from-emerald-900/20 dark:to-green-900/20 border-emerald-200 dark:border-emerald-800'
          : 'bg-gradient-to-br from-red-50 to-rose-50 dark:from-red-900/20 dark:to-rose-900/20 border-red-200 dark:border-red-800'
      }`}>
        <div className="flex items-center justify-between mb-4">
          <div className={`p-3 rounded-xl shadow-md group-hover:scale-110 transition-transform ${
            netProfit >= 0
              ? 'bg-gradient-to-br from-emerald-500 to-green-600'
              : 'bg-gradient-to-br from-red-500 to-rose-600'
          }`}>
            <ArrowTrendingUpIcon className="w-6 h-6 text-white" />
          </div>
          <span className={`text-xs font-semibold px-2 py-1 rounded-full ${
            netProfit >= 0
              ? 'text-emerald-700 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-900/30'
              : 'text-red-700 dark:text-red-300 bg-red-100 dark:bg-red-900/30'
          }`}>
            {netProfit >= 0 ? 'Profit' : 'Loss'}
          </span>
        </div>
        <div>
          <p className={`text-sm font-medium mb-1 ${
            netProfit >= 0
              ? 'text-emerald-700 dark:text-emerald-300'
              : 'text-red-700 dark:text-red-300'
          }`}>
            Net Profit
          </p>
          <p className={`text-2xl md:text-3xl font-bold ${
            netProfit >= 0
              ? 'text-emerald-900 dark:text-emerald-100'
              : 'text-red-900 dark:text-red-100'
          }`}>
            {formatCurrency(netProfit)}
          </p>
        </div>
      </div>

      {/* Active Projects Card */}
      <div className="group bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-2xl shadow-lg hover:shadow-xl border border-blue-200 dark:border-blue-800 p-6 transition-all duration-300 transform hover:scale-105 card-hover">
        <div className="flex items-center justify-between mb-4">
          <div className="p-3 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl shadow-md group-hover:scale-110 transition-transform">
            <FolderIcon className="w-6 h-6 text-white" />
          </div>
          <span className="text-xs font-semibold text-blue-700 dark:text-blue-300 bg-blue-100 dark:bg-blue-900/30 px-2 py-1 rounded-full">
            Active
          </span>
        </div>
        <div>
          <p className="text-sm font-medium text-blue-700 dark:text-blue-300 mb-1">Active Projects</p>
          <p className="text-2xl md:text-3xl font-bold text-blue-900 dark:text-blue-100">
            {activeProjectsCount}
          </p>
        </div>
      </div>
    </div>
  );
}
