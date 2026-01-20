import Link from 'next/link';
import { getProjects } from '@/lib/actions/projects';
import { getProjectTotalReceived } from '@/lib/actions/payments';
import { PlusIcon } from '@heroicons/react/24/outline';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { formatCurrency } from '@/lib/utils/currency';

export const dynamic = 'force-dynamic';

export default async function ProjectsPage() {
  const session = await getServerSession(authOptions) as any;
  const canEdit = session?.user?.role === 'admin' || session?.user?.role === 'manager';
  
  const result = await getProjects();

  if (!result.success) {
    return (
      <div className="p-6">
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
          <p className="text-red-800 dark:text-red-200">Error loading projects: {result.error}</p>
        </div>
      </div>
    );
  }

  const projects = result.projects || [];

  return (
    <div className="p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-text-light dark:text-text-dark">Projects</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">Manage your company projects</p>
          </div>
          {canEdit && (
            <Link
              href="/projects/new"
              className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors font-medium"
            >
              <PlusIcon className="w-5 h-5" />
              <span className="hidden sm:inline">New Project</span>
            </Link>
          )}
        </div>

        {projects.length === 0 ? (
          <div className="bg-card-light dark:bg-card-dark rounded-lg shadow-sm p-12 border border-gray-200 dark:border-gray-700 text-center">
            <p className="text-gray-600 dark:text-gray-400 mb-4">No projects yet</p>
            {canEdit && (
              <Link
                href="/projects/new"
                className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
              >
                <PlusIcon className="w-5 h-5" />
                Create your first project
              </Link>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {projects.map(async (project: any) => {
              const paymentResult = await getProjectTotalReceived(project._id);
              const totalReceived = paymentResult.success ? paymentResult.total : 0;
              const totalBudget = project.totalBudget || project.expectedTotalAmount || 0;
              const remaining = totalBudget - totalReceived;
              const progress = totalBudget > 0 
                ? (totalReceived / totalBudget) * 100 
                : 0;
              const currency = project.currency || 'USD';

              return (
                <Link
                  key={project._id}
                  href={`/projects/${project._id}`}
                  className="bg-card-light dark:bg-card-dark rounded-lg shadow-sm p-6 border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow"
                >
                  <h3 className="text-lg font-semibold text-text-light dark:text-text-dark mb-2">
                    {project.name}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">Client: {project.clientName}</p>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-400">Budget:</span>
                      <span className="font-medium text-text-light dark:text-text-dark">
                        {formatCurrency(totalBudget, currency)}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-400">Received:</span>
                      <span className="font-medium text-secondary">
                        {formatCurrency(totalReceived, currency)}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-400">Remaining:</span>
                      <span className={`font-medium ${remaining > 0 ? 'text-accent' : 'text-text-light dark:text-text-dark'}`}>
                        {formatCurrency(remaining, currency)}
                      </span>
                    </div>
                  </div>

                  <div className="mt-4">
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div
                        className="bg-primary h-2 rounded-full transition-all"
                        style={{ width: `${Math.min(progress, 100)}%` }}
                      />
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      {progress.toFixed(0)}% complete
                    </p>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
