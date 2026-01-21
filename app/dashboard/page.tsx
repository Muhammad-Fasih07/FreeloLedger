import { Suspense } from 'react';
import DashboardCards from '@/components/DashboardCards';
import MonthSelector from '@/components/MonthSelector';
import { getDashboardData } from '@/lib/actions/dashboard';
import { getProjects } from '@/lib/actions/projects';
import IncomeExpenseChart from '@/components/IncomeExpenseChart';
import ProjectProfitabilityChart from '@/components/ProjectProfitabilityChart';
import TeamPayoutDistributionChart from '@/components/TeamPayoutDistributionChart';
import EnhancedProjectCard from '@/components/EnhancedProjectCard';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import Link from 'next/link';
import { PlusIcon } from '@heroicons/react/24/outline';

export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const runtime = 'nodejs';

interface DashboardPageProps {
  searchParams: { month?: string; year?: string };
}

export default async function DashboardPage({ searchParams }: DashboardPageProps) {
  const now = new Date();
  const month = parseInt(searchParams.month || String(now.getMonth() + 1));
  const year = parseInt(searchParams.year || String(now.getFullYear()));

  const session = await getServerSession(authOptions) as any;
  const canEdit = session?.user?.role === 'admin' || session?.user?.role === 'manager';

  // Optimize: Fetch data in parallel
  const [result, projectsResult] = await Promise.all([
    getDashboardData(month, year),
    getProjects(),
  ]);
  const projects = projectsResult.success ? projectsResult.projects : [];

  if (!result.success || !result.data) {
    return (
      <div className="p-6">
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
          <p className="text-red-800 dark:text-red-200">Error loading dashboard: {result.error || 'Unknown error'}</p>
        </div>
      </div>
    );
  }

  const { data } = result;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 overflow-x-hidden w-full">
      <div className="w-full p-4 sm:p-6 md:p-6 lg:p-8 overflow-x-hidden">
        <div className="max-w-7xl mx-auto space-y-4 sm:space-y-6">
          {/* Header Section */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="space-y-1">
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 dark:from-gray-100 dark:via-gray-200 dark:to-gray-100 bg-clip-text text-transparent">
                Dashboard
              </h1>
              <p className="text-gray-600 dark:text-gray-400 text-sm md:text-base">
                Complete overview of your company finances
              </p>
            </div>
            {canEdit && (
              <Link
                href="/projects/new"
                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
              >
                <PlusIcon className="w-5 h-5" />
                <span className="hidden sm:inline">New Project</span>
                <span className="sm:hidden">New</span>
              </Link>
            )}
          </div>

          {/* Month Selector */}
          <Suspense fallback={<div className="h-20 bg-gray-100 dark:bg-gray-800 rounded-xl animate-pulse" />}>
            <MonthSelector />
          </Suspense>

          {/* Summary Cards */}
          <DashboardCards
            totalIncome={data.totalIncome}
            totalExpenses={data.totalExpenses}
            netProfit={data.netProfit}
            activeProjectsCount={data.activeProjectsCount}
            currency={data.defaultCurrency || 'USD'}
          />

          {/* Projects Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-gray-100">Your Projects</h2>
              {canEdit && (
                <Link
                  href="/projects/new"
                  className="md:hidden inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg font-medium text-sm shadow-md hover:shadow-lg transition-all"
                >
                  <PlusIcon className="w-4 h-4" />
                  Add Project
                </Link>
              )}
            </div>

            {projects.length === 0 ? (
              <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-lg p-12 border border-gray-200 dark:border-gray-700 text-center">
                <p className="text-gray-600 dark:text-gray-400 mb-4 text-lg">No projects yet</p>
                {canEdit && (
                  <Link
                    href="/projects/new"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all transform hover:scale-105"
                  >
                    <PlusIcon className="w-5 h-5" />
                    Create Your First Project
                  </Link>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-5 lg:gap-6">
                {projects.map((project: any) => (
                  <Suspense 
                    key={project._id || project.id}
                    fallback={
                      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-200 dark:border-gray-700 p-4 animate-pulse">
                        <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2"></div>
                        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                      </div>
                    }
                  >
                    <EnhancedProjectCard 
                      project={project}
                      currentMonth={month}
                      currentYear={year}
                    />
                  </Suspense>
                ))}
              </div>
            )}
          </div>

          {/* Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-5 lg:gap-6">
            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
              <h3 className="text-lg md:text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
                Income vs Expenses (6 Months)
              </h3>
              <IncomeExpenseChart data={data.trendData} currency={data.defaultCurrency || 'USD'} />
            </div>

            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
              <h3 className="text-lg md:text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
                Project Profitability
              </h3>
              {data.projectProfitability.length > 0 ? (
                <ProjectProfitabilityChart data={data.projectProfitability} />
              ) : (
                <div className="flex items-center justify-center h-64 text-gray-500 dark:text-gray-400">
                  No project data for this month
                </div>
              )}
            </div>
          </div>

          {/* Team Payout Chart */}
          {data.teamPayoutDistribution && data.teamPayoutDistribution.length > 0 && (
            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
              <h3 className="text-lg md:text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
                Team Payout Distribution
              </h3>
              <TeamPayoutDistributionChart data={data.teamPayoutDistribution} currency={data.defaultCurrency || 'USD'} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
