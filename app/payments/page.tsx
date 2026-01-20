import { getPayments } from '@/lib/actions/payments';
import { getProjects } from '@/lib/actions/projects';
import PaymentForm from '@/components/PaymentForm';
import { format } from 'date-fns';
import DeletePaymentButton from '@/components/DeletePaymentButton';
import { formatCurrency } from '@/lib/utils/currency';

export const dynamic = 'force-dynamic';

interface PaymentsPageProps {
  searchParams: { month?: string; year?: string; projectId?: string };
}

export default async function PaymentsPage({ searchParams }: PaymentsPageProps) {
  const now = new Date();
  const month = searchParams.month ? parseInt(searchParams.month) : now.getMonth() + 1;
  const year = searchParams.year ? parseInt(searchParams.year) : now.getFullYear();
  const projectId = searchParams.projectId;

  // Optimize: Fetch data in parallel
  const [paymentsResult, projectsResult] = await Promise.all([
    getPayments(month, year, projectId),
    getProjects(),
  ]);
  const payments = paymentsResult.success ? paymentsResult.payments : [];
  const projects = projectsResult.success ? projectsResult.projects : [];

  return (
    <div className="p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-text-light dark:text-text-dark">Payments</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Record money received from clients</p>
          <div className="mt-3 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
            <p className="text-sm text-green-800 dark:text-green-200">
              <strong>💰 How to add payment:</strong> Select the project → Enter the amount you received → Choose the date → Add notes (optional) → Click "Add Payment"
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <div className="bg-card-light dark:bg-card-dark rounded-lg shadow-sm p-6 border border-gray-200 dark:border-gray-700 sticky top-4">
              <h2 className="text-lg font-semibold text-text-light dark:text-text-dark mb-4">Add Payment</h2>
              <PaymentForm month={month} year={year} projects={projects} />
            </div>
          </div>

          <div className="lg:col-span-2">
            <div className="bg-card-light dark:bg-card-dark rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                <h2 className="text-lg font-semibold text-text-light dark:text-text-dark">
                  Payments - {format(new Date(year, month - 1, 1), 'MMMM yyyy')}
                </h2>
              </div>

              {payments.length === 0 ? (
                <div className="p-12 text-center">
                  <p className="text-gray-500 dark:text-gray-400">No payments recorded for this month</p>
                </div>
              ) : (
                <div className="divide-y divide-gray-200 dark:divide-gray-700">
                  {/* Mobile: Cards */}
                  <div className="md:hidden">
                    {payments.map((payment: any) => (
                      <PaymentCard key={payment._id} payment={payment} />
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
                            Amount
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                            Date
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                            Notes
                          </th>
                          <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-card-light dark:bg-card-dark divide-y divide-gray-200 dark:divide-gray-700">
                        {payments.map((payment: any) => (
                          <tr key={payment._id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div>
                                <div className="text-sm font-medium text-text-light dark:text-text-dark">
                                  {payment.projectId?.name || 'Unknown'}
                                </div>
                                <div className="text-sm text-gray-500 dark:text-gray-400">
                                  {payment.projectId?.clientName || ''}
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className="text-sm font-semibold text-secondary">
                                {formatCurrency(payment.amount, payment.projectId?.currency || 'USD')}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                              {format(new Date(payment.date || payment.dateReceived), 'MMM dd, yyyy')}
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                              {payment.notes || '-'}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                              <DeletePaymentButton paymentId={payment._id} />
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

function PaymentCard({ payment }: { payment: any }) {
  return (
    <div className="p-4">
      <div className="flex justify-between items-start mb-2">
        <div>
          <h3 className="font-semibold text-text-light dark:text-text-dark">{payment.projectId?.name || 'Unknown'}</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">{payment.projectId?.clientName || ''}</p>
        </div>
        <span className="text-lg font-semibold text-secondary">
          {formatCurrency(payment.amount, payment.projectId?.currency || 'USD')}
        </span>
      </div>
      <div className="flex justify-between items-center text-sm text-gray-500 dark:text-gray-400">
        <span>{format(new Date(payment.date || payment.dateReceived), 'MMM dd, yyyy')}</span>
        <DeletePaymentButton paymentId={payment._id} />
      </div>
      {payment.notes && (
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">{payment.notes}</p>
      )}
    </div>
  );
}
