'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { format } from 'date-fns';
import { ChevronLeftIcon, ChevronRightIcon, CalendarIcon } from '@heroicons/react/24/outline';

export default function MonthSelector() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentMonth = parseInt(searchParams.get('month') || String(new Date().getMonth() + 1));
  const currentYear = parseInt(searchParams.get('year') || String(new Date().getFullYear()));

  const handleMonthChange = (month: number, year: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('month', String(month));
    params.set('year', String(year));
    router.push(`?${params.toString()}`);
  };

  const goToPreviousMonth = () => {
    const date = new Date(currentYear, currentMonth - 1, 1);
    date.setMonth(date.getMonth() - 1);
    handleMonthChange(date.getMonth() + 1, date.getFullYear());
  };

  const goToNextMonth = () => {
    const date = new Date(currentYear, currentMonth - 1, 1);
    date.setMonth(date.getMonth() + 1);
    handleMonthChange(date.getMonth() + 1, date.getFullYear());
  };

  const goToCurrentMonth = () => {
    const now = new Date();
    handleMonthChange(now.getMonth() + 1, now.getFullYear());
  };

  const currentMonthLabel = format(new Date(currentYear, currentMonth - 1, 1), 'MMMM yyyy');
  const isCurrentMonth =
    currentMonth === new Date().getMonth() + 1 && currentYear === new Date().getFullYear();

  return (
    <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-4 md:p-6">
      <div className="flex items-center justify-between">
        <button
          onClick={goToPreviousMonth}
          className="p-2 md:p-3 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-200 hover:scale-110 active:scale-95 border border-transparent hover:border-gray-200 dark:hover:border-gray-600"
          aria-label="Previous month"
        >
          <ChevronLeftIcon className="w-5 h-5 md:w-6 md:h-6 text-gray-600 dark:text-gray-400" />
        </button>

        <div className="flex items-center gap-3 md:gap-4">
          <div className="p-2 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-md">
            <CalendarIcon className="w-5 h-5 md:w-6 md:h-6 text-white" />
          </div>
          <div className="text-center">
            <h2 className="text-lg md:text-xl lg:text-2xl font-bold text-gray-900 dark:text-gray-100">
              {currentMonthLabel}
            </h2>
            {!isCurrentMonth && (
              <button
                onClick={goToCurrentMonth}
                className="mt-1 px-3 py-1 text-xs md:text-sm bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-lg font-medium shadow-md hover:shadow-lg transition-all duration-200 transform hover:scale-105"
              >
                Jump to Today
              </button>
            )}
          </div>
        </div>

        <button
          onClick={goToNextMonth}
          className="p-2 md:p-3 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-200 hover:scale-110 active:scale-95 border border-transparent hover:border-gray-200 dark:hover:border-gray-600"
          aria-label="Next month"
        >
          <ChevronRightIcon className="w-5 h-5 md:w-6 md:h-6 text-gray-600 dark:text-gray-400" />
        </button>
      </div>
    </div>
  );
}
