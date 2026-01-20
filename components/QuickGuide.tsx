'use client';

import { InformationCircleIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { useState } from 'react';

export default function QuickGuide() {
  const [isOpen, setIsOpen] = useState(true);

  if (!isOpen) return null;

  return (
    <div className="bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 dark:from-blue-900/20 dark:via-indigo-900/20 dark:to-purple-900/20 border border-blue-200 dark:border-blue-800 rounded-2xl p-4 md:p-5 shadow-lg backdrop-blur-sm">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-3 flex-1">
          <div className="p-2 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl shadow-md flex-shrink-0">
            <InformationCircleIcon className="w-5 h-5 md:w-6 md:h-6 text-white" />
          </div>
          <div className="flex-1 space-y-2">
            <h3 className="text-sm md:text-base font-bold text-gray-900 dark:text-gray-100">Quick Guide</h3>
            <div className="text-xs md:text-sm text-gray-700 dark:text-gray-300 space-y-1.5">
              <p className="flex items-start gap-2">
                <span className="font-semibold text-blue-600 dark:text-blue-400">1. Add Team Members:</span>
                <span>Go to "Team" page → Fill form → Click "Add Team Member"</span>
              </p>
              <p className="flex items-start gap-2">
                <span className="font-semibold text-green-600 dark:text-green-400">2. Record Payments:</span>
                <span>Go to "Payments" page → Select project → Enter amount & date → Click "Add Payment"</span>
              </p>
              <p className="flex items-start gap-2">
                <span className="font-semibold text-purple-600 dark:text-purple-400">3. Pay Team Members:</span>
                <span>Go to "Expenses" page → Select "Team Payout" → Choose team member → Enter amount → Click "Add Expense"</span>
              </p>
            </div>
          </div>
        </div>
        <button
          onClick={() => setIsOpen(false)}
          className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-white/50 dark:hover:bg-gray-800/50 transition-all flex-shrink-0"
          aria-label="Close guide"
        >
          <XMarkIcon className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
