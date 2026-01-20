'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { createProject, updateProject } from '@/lib/actions/projects';

interface EnhancedProjectFormProps {
  project?: any;
}

const CURRENCIES = [
  { code: 'USD', name: 'US Dollar ($)' },
  { code: 'EUR', name: 'Euro (€)' },
  { code: 'GBP', name: 'British Pound (£)' },
  { code: 'INR', name: 'Indian Rupee (₹)' },
  { code: 'CAD', name: 'Canadian Dollar (C$)' },
  { code: 'AUD', name: 'Australian Dollar (A$)' },
  { code: 'JPY', name: 'Japanese Yen (¥)' },
  { code: 'CNY', name: 'Chinese Yuan (¥)' },
  { code: 'AED', name: 'UAE Dirham (د.إ)' },
  { code: 'SAR', name: 'Saudi Riyal (﷼)' },
  { code: 'PKR', name: 'Pakistani Rupee (₨)' },
  { code: 'BDT', name: 'Bangladeshi Taka (৳)' },
  { code: 'LKR', name: 'Sri Lankan Rupee (Rs)' },
  { code: 'NPR', name: 'Nepalese Rupee (₨)' },
  { code: 'MYR', name: 'Malaysian Ringgit (RM)' },
  { code: 'SGD', name: 'Singapore Dollar (S$)' },
  { code: 'THB', name: 'Thai Baht (฿)' },
  { code: 'PHP', name: 'Philippine Peso (₱)' },
  { code: 'IDR', name: 'Indonesian Rupiah (Rp)' },
  { code: 'VND', name: 'Vietnamese Dong (₫)' },
  { code: 'KRW', name: 'South Korean Won (₩)' },
  { code: 'HKD', name: 'Hong Kong Dollar (HK$)' },
  { code: 'NZD', name: 'New Zealand Dollar (NZ$)' },
  { code: 'ZAR', name: 'South African Rand (R)' },
  { code: 'BRL', name: 'Brazilian Real (R$)' },
  { code: 'MXN', name: 'Mexican Peso (Mex$)' },
  { code: 'CHF', name: 'Swiss Franc (CHF)' },
  { code: 'SEK', name: 'Swedish Krona (kr)' },
  { code: 'NOK', name: 'Norwegian Krone (kr)' },
  { code: 'DKK', name: 'Danish Krone (kr)' },
  { code: 'PLN', name: 'Polish Zloty (zł)' },
  { code: 'CZK', name: 'Czech Koruna (Kč)' },
  { code: 'HUF', name: 'Hungarian Forint (Ft)' },
  { code: 'RON', name: 'Romanian Leu (lei)' },
  { code: 'BGN', name: 'Bulgarian Lev (лв)' },
  { code: 'HRK', name: 'Croatian Kuna (kn)' },
  { code: 'RUB', name: 'Russian Ruble (₽)' },
  { code: 'TRY', name: 'Turkish Lira (₺)' },
  { code: 'ILS', name: 'Israeli Shekel (₪)' },
  { code: 'EGP', name: 'Egyptian Pound (E£)' },
  { code: 'NGN', name: 'Nigerian Naira (₦)' },
  { code: 'KES', name: 'Kenyan Shilling (KSh)' },
  { code: 'GHS', name: 'Ghanaian Cedi (₵)' },
  { code: 'UGX', name: 'Ugandan Shilling (USh)' },
  { code: 'TZS', name: 'Tanzanian Shilling (TSh)' },
  { code: 'ETB', name: 'Ethiopian Birr (Br)' },
  { code: 'MAD', name: 'Moroccan Dirham (د.م.)' },
  { code: 'TND', name: 'Tunisian Dinar (د.ت)' },
  { code: 'DZD', name: 'Algerian Dinar (د.ج)' },
  { code: 'SDG', name: 'Sudanese Pound (ج.س.)' },
  { code: 'SSP', name: 'South Sudanese Pound (SS£)' },
  { code: 'ZWL', name: 'Zimbabwean Dollar (Z$)' },
  { code: 'XOF', name: 'West African CFA Franc (CFA)' },
  { code: 'XAF', name: 'Central African CFA Franc (FCFA)' },
  { code: 'XPF', name: 'CFP Franc (F)' },
  { code: 'ANG', name: 'Netherlands Antillean Guilder (ƒ)' },
  { code: 'AWG', name: 'Aruban Florin (ƒ)' },
  { code: 'BBD', name: 'Barbadian Dollar (Bds$)' },
  { code: 'BMD', name: 'Bermudian Dollar (BD$)' },
  { code: 'BZD', name: 'Belize Dollar (BZ$)' },
  { code: 'BSD', name: 'Bahamian Dollar (B$)' },
  { code: 'BWP', name: 'Botswana Pula (P)' },
  { code: 'BND', name: 'Brunei Dollar (B$)' },
  { code: 'KHR', name: 'Cambodian Riel (៛)' },
  { code: 'KYD', name: 'Cayman Islands Dollar (CI$)' },
  { code: 'FJD', name: 'Fijian Dollar (FJ$)' },
  { code: 'GYD', name: 'Guyanese Dollar (GY$)' },
  { code: 'HTG', name: 'Haitian Gourde (G)' },
  { code: 'JMD', name: 'Jamaican Dollar (J$)' },
  { code: 'KZT', name: 'Kazakhstani Tenge (₸)' },
  { code: 'KWD', name: 'Kuwaiti Dinar (د.ك)' },
  { code: 'KGS', name: 'Kyrgystani Som (сом)' },
  { code: 'LAK', name: 'Laotian Kip (₭)' },
  { code: 'LBP', name: 'Lebanese Pound (ل.ل)' },
  { code: 'LRD', name: 'Liberian Dollar (L$)' },
  { code: 'LSL', name: 'Lesotho Loti (L)' },
  { code: 'MOP', name: 'Macanese Pataca (MOP$)' },
  { code: 'MUR', name: 'Mauritian Rupee (₨)' },
  { code: 'MVR', name: 'Maldivian Rufiyaa (Rf)' },
  { code: 'MWK', name: 'Malawian Kwacha (MK)' },
  { code: 'MZN', name: 'Mozambican Metical (MT)' },
  { code: 'NAD', name: 'Namibian Dollar (N$)' },
  { code: 'NIO', name: 'Nicaraguan Córdoba (C$)' },
  { code: 'OMR', name: 'Omani Rial (ر.ع.)' },
  { code: 'PAB', name: 'Panamanian Balboa (B/.)' },
  { code: 'PGK', name: 'Papua New Guinean Kina (K)' },
  { code: 'PYG', name: 'Paraguayan Guaraní (₲)' },
  { code: 'QAR', name: 'Qatari Rial (ر.ق)' },
  { code: 'RWF', name: 'Rwandan Franc (RF)' },
  { code: 'SBD', name: 'Solomon Islands Dollar (SI$)' },
  { code: 'SCR', name: 'Seychellois Rupee (₨)' },
  { code: 'SLL', name: 'Sierra Leonean Leone (Le)' },
  { code: 'SOS', name: 'Somali Shilling (Sh.So.)' },
  { code: 'SRD', name: 'Surinamese Dollar (SRD)' },
  { code: 'STN', name: 'São Tomé and Príncipe Dobra (Db)' },
  { code: 'SYP', name: 'Syrian Pound (ل.س)' },
  { code: 'SZL', name: 'Swazi Lilangeni (E)' },
  { code: 'TJS', name: 'Tajikistani Somoni (SM)' },
  { code: 'TMT', name: 'Turkmenistani Manat (m)' },
  { code: 'TOP', name: 'Tongan Paʻanga (T$)' },
  { code: 'TTD', name: 'Trinidad and Tobago Dollar (TT$)' },
  { code: 'TWD', name: 'New Taiwan Dollar (NT$)' },
  { code: 'UAH', name: 'Ukrainian Hryvnia (₴)' },
  { code: 'UYU', name: 'Uruguayan Peso ($U)' },
  { code: 'UZS', name: 'Uzbekistani Som (so\'m)' },
  { code: 'VUV', name: 'Vanuatu Vatu (Vt)' },
  { code: 'WST', name: 'Samoan Tala (T)' },
  { code: 'XCD', name: 'East Caribbean Dollar (EC$)' },
  { code: 'YER', name: 'Yemeni Rial (﷼)' },
  { code: 'ZMW', name: 'Zambian Kwacha (ZK)' },
  { code: 'BTC', name: 'Bitcoin (₿)' },
  { code: 'ETH', name: 'Ethereum (Ξ)' },
];

export default function EnhancedProjectForm({ project }: EnhancedProjectFormProps) {
  const router = useRouter();
  const { data: session } = useSession();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const role = (session?.user as any)?.role;
  const canEdit = role === 'admin' || role === 'manager';
  
  if (!canEdit) {
    return (
      <div className="text-center py-8 text-gray-500 dark:text-gray-400">
        <p className="text-sm">Only admins and managers can edit projects</p>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    const formData = new FormData(e.currentTarget);

    try {
      const result = project
        ? await updateProject(project._id, formData)
        : await createProject(formData);

      if (result.success) {
        if (project) {
          router.push('/projects');
          router.refresh();
        } else {
          e.currentTarget.reset();
          router.refresh();
        }
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
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
          <p className="text-red-800 dark:text-red-200 text-sm">{error}</p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Project Name *
          </label>
          <input
            type="text"
            id="name"
            name="name"
            required
            defaultValue={project?.name || ''}
            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-text-light dark:text-text-dark focus:ring-2 focus:ring-primary focus:border-primary"
            placeholder="e.g., Website Redesign"
          />
        </div>

        <div>
          <label htmlFor="clientName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Client Name *
          </label>
          <input
            type="text"
            id="clientName"
            name="clientName"
            required
            defaultValue={project?.clientName || ''}
            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-text-light dark:text-text-dark focus:ring-2 focus:ring-primary focus:border-primary"
            placeholder="e.g., Acme Corp"
          />
        </div>

        <div>
          <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Start Date *
          </label>
          <input
            type="date"
            id="startDate"
            name="startDate"
            required
            defaultValue={
              project?.startDate
                ? new Date(project.startDate).toISOString().split('T')[0]
                : new Date().toISOString().split('T')[0]
            }
            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-text-light dark:text-text-dark focus:ring-2 focus:ring-primary focus:border-primary"
          />
        </div>

        <div>
          <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            End Date (Optional)
          </label>
          <input
            type="date"
            id="endDate"
            name="endDate"
            defaultValue={
              project?.endDate
                ? new Date(project.endDate).toISOString().split('T')[0]
                : ''
            }
            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-text-light dark:text-text-dark focus:ring-2 focus:ring-primary focus:border-primary"
          />
        </div>

        <div>
          <label htmlFor="currency" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Currency *
          </label>
          <select
            id="currency"
            name="currency"
            required
            defaultValue={project?.currency || 'USD'}
            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-text-light dark:text-text-dark focus:ring-2 focus:ring-primary focus:border-primary"
          >
            {CURRENCIES.map((curr) => (
              <option key={curr.code} value={curr.code}>
                {curr.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label
            htmlFor="totalBudget"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
          >
            Total Budget *
          </label>
          <input
            type="number"
            id="totalBudget"
            name="totalBudget"
            required
            min="0"
            step="0.01"
            defaultValue={project?.totalBudget || project?.expectedTotalAmount || ''}
            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-text-light dark:text-text-dark focus:ring-2 focus:ring-primary focus:border-primary"
            placeholder="0.00"
          />
        </div>
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Project Description
        </label>
        <textarea
          id="description"
          name="description"
          rows={4}
          defaultValue={project?.description || ''}
          className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-text-light dark:text-text-dark focus:ring-2 focus:ring-primary focus:border-primary resize-none"
          placeholder="Describe the project, scope, deliverables, and any important details..."
        />
      </div>

      <div className="flex gap-4 pt-4">
        <button
          type="submit"
          disabled={isSubmitting}
          className="flex-1 px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? 'Saving...' : project ? 'Update Project' : 'Create Project'}
        </button>
        {project && (
          <button
            type="button"
            onClick={() => router.back()}
            className="px-6 py-3 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors font-medium"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}
