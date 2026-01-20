'use client';

import { useTheme } from './ThemeProvider';
import { SunIcon, MoonIcon } from '@heroicons/react/24/outline';
import { useEffect, useState } from 'react';

export default function ThemeToggle() {
  const [mounted, setMounted] = useState(false);
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <button
        className="p-2.5 rounded-xl bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 transition-all"
        aria-label="Toggle theme"
        disabled
      >
        <SunIcon className="w-5 h-5 text-gray-400" />
      </button>
    );
  }

  return (
    <button
      onClick={toggleTheme}
      className="p-2.5 rounded-xl bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 border border-gray-200 dark:border-gray-700 hover:from-gray-200 hover:to-gray-300 dark:hover:from-gray-700 dark:hover:to-gray-600 transition-all duration-200 hover:scale-110 active:scale-95 shadow-md hover:shadow-lg"
      aria-label="Toggle theme"
    >
      {theme === 'light' ? (
        <MoonIcon className="w-5 h-5 text-gray-700 dark:text-gray-300 transition-transform" />
      ) : (
        <SunIcon className="w-5 h-5 text-yellow-500 dark:text-yellow-400 transition-transform" />
      )}
    </button>
  );
}
