'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
// @ts-ignore
import { useSession, signOut } from 'next-auth/react';
import { 
  HomeIcon, 
  FolderIcon, 
  CurrencyDollarIcon, 
  ReceiptPercentIcon, 
  UsersIcon,
  Cog6ToothIcon,
  ArrowRightOnRectangleIcon
} from '@heroicons/react/24/outline';
import { 
  HomeIcon as HomeIconSolid, 
  FolderIcon as FolderIconSolid, 
  CurrencyDollarIcon as CurrencyDollarIconSolid, 
  ReceiptPercentIcon as ReceiptPercentIconSolid, 
  UsersIcon as UsersIconSolid,
  Cog6ToothIcon as Cog6ToothIconSolid
} from '@heroicons/react/24/solid';
import clsx from 'clsx';
import ThemeToggle from './ThemeToggle';

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: HomeIcon, iconSolid: HomeIconSolid, color: 'blue' },
  { href: '/projects', label: 'Projects', icon: FolderIcon, iconSolid: FolderIconSolid, color: 'purple' },
  { href: '/payments', label: 'Payments', icon: CurrencyDollarIcon, iconSolid: CurrencyDollarIconSolid, color: 'green' },
  { href: '/expenses', label: 'Expenses', icon: ReceiptPercentIcon, iconSolid: ReceiptPercentIconSolid, color: 'red' },
  { href: '/team', label: 'Team', icon: UsersIcon, iconSolid: UsersIconSolid, color: 'orange' },
  { href: '/settings', label: 'Settings', icon: Cog6ToothIcon, iconSolid: Cog6ToothIconSolid, color: 'gray' },
];

const colorClasses = {
  blue: {
    active: 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-800',
    hover: 'hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:text-blue-600 dark:hover:text-blue-400',
  },
  purple: {
    active: 'bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 border-purple-200 dark:border-purple-800',
    hover: 'hover:bg-purple-50 dark:hover:bg-purple-900/20 hover:text-purple-600 dark:hover:text-purple-400',
  },
  green: {
    active: 'bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 border-green-200 dark:border-green-800',
    hover: 'hover:bg-green-50 dark:hover:bg-green-900/20 hover:text-green-600 dark:hover:text-green-400',
  },
  red: {
    active: 'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 border-red-200 dark:border-red-800',
    hover: 'hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 dark:hover:text-red-400',
  },
  orange: {
    active: 'bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400 border-orange-200 dark:border-orange-800',
    hover: 'hover:bg-orange-50 dark:hover:bg-orange-900/20 hover:text-orange-600 dark:hover:text-orange-400',
  },
  gray: {
    active: 'bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-700',
    hover: 'hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-gray-700 dark:hover:text-gray-300',
  },
};

export default function Navigation() {
  const pathname = usePathname();
  const { data: session, status } = useSession() as any;

  // Don't show navigation on login/signup pages
  if (pathname === '/login' || pathname === '/signup') {
    return null;
  }

  const handleLogout = async () => {
    try {
      await signOut({ callbackUrl: '/login' });
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  // Show logout button if session exists or is loading (to avoid flicker)
  const showLogout = status === 'authenticated' || (session && session.user);

  const getRoleLabel = (role: string) => {
    const roleMap: Record<string, string> = {
      admin: 'Admin',
      manager: 'Manager',
      member: 'Member',
    };
    return roleMap[role] || role;
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'admin':
        return 'bg-gradient-to-r from-blue-500 to-blue-600 text-white';
      case 'manager':
        return 'bg-gradient-to-r from-purple-500 to-purple-600 text-white';
      case 'member':
        return 'bg-gradient-to-r from-gray-500 to-gray-600 text-white';
      default:
        return 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300';
    }
  };

  return (
    <>
      {/* Mobile Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white/95 dark:bg-gray-900/95 backdrop-blur-lg border-t border-gray-200 dark:border-gray-800 md:hidden shadow-lg">
        <div className="flex justify-around items-center h-20 px-1">
          {navItems.slice(0, 5).map((item) => {
            const isActive = pathname === item.href || pathname?.startsWith(item.href + '/');
            const Icon = isActive ? item.iconSolid : item.icon;
            const colors = colorClasses[item.color as keyof typeof colorClasses];
            
            return (
              <Link
                key={item.href}
                href={item.href}
                className={clsx(
                  'flex flex-col items-center justify-center flex-1 h-full transition-all duration-200 rounded-lg mx-0.5',
                  isActive
                    ? `${colors.active} shadow-sm scale-105`
                    : `${colors.hover} text-gray-600 dark:text-gray-400`
                )}
              >
                <Icon className={clsx('w-5 h-5 mb-1', isActive && 'scale-110')} />
                <span className={clsx('text-xs font-medium', isActive && 'font-semibold')}>{item.label}</span>
              </Link>
            );
          })}
          {/* Logout Button on Mobile */}
          {showLogout && (
            <button
              onClick={handleLogout}
              className="flex flex-col items-center justify-center flex-1 h-full transition-all duration-200 rounded-lg mx-0.5 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 active:scale-95"
              aria-label="Sign out"
            >
              <ArrowRightOnRectangleIcon className="w-5 h-5 mb-1" />
              <span className="text-xs font-medium">Logout</span>
            </button>
          )}
        </div>
      </nav>

      {/* Desktop Sidebar */}
      <aside className="hidden md:block md:fixed md:inset-y-0 md:left-0 md:z-40 md:w-72 md:bg-white/95 dark:md:bg-gray-900/95 md:backdrop-blur-lg md:border-r md:border-gray-200 dark:md:border-gray-800 md:shadow-xl md:overflow-y-auto md:overflow-x-hidden">
        <div className="flex flex-col h-full w-full">
          {/* Logo & Header */}
          <div className="flex items-center justify-between h-20 px-6 border-b border-gray-200 dark:border-gray-800">
            <div className="flex items-center gap-3">
              {/* Favicon */}
              <div className="w-10 h-10 rounded-xl flex items-center justify-center overflow-hidden">
                <img
                  src="/favicon.png"
                  alt="FreeloLedger"
                  className="w-full h-full object-contain"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                  }}
                />
              </div>
              <div>
                <h1 className="text-lg font-bold text-gray-900 dark:text-gray-100">
                  FreeloLedger
                </h1>
              </div>
            </div>
            <ThemeToggle />
          </div>

          {/* User Info */}
          {session && (
            <div className="px-6 py-5 border-b border-gray-200 dark:border-gray-800 bg-gradient-to-r from-gray-50 to-transparent dark:from-gray-800/50 dark:to-transparent">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white font-semibold shadow-md">
                  {session.user.name?.charAt(0).toUpperCase() || 'U'}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-900 dark:text-gray-100 truncate">
                    {session.user.name}
                  </p>
                  <p className={clsx('text-xs px-2 py-0.5 rounded-full inline-block mt-1', getRoleBadgeColor(session.user.role))}>
                    {getRoleLabel(session.user.role)}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Navigation Menu */}
          <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
            {navItems.map((item) => {
              const isActive = pathname === item.href || pathname?.startsWith(item.href + '/');
              const Icon = isActive ? item.iconSolid : item.icon;
              const colors = colorClasses[item.color as keyof typeof colorClasses];
              
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={clsx(
                    'flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 group relative',
                    isActive
                      ? `${colors.active} shadow-md border-l-4`
                      : `text-gray-700 dark:text-gray-300 ${colors.hover} border-l-4 border-transparent`
                  )}
                >
                  <Icon className={clsx('w-5 h-5 mr-3 transition-transform', isActive ? 'scale-110' : 'group-hover:scale-110')} />
                  <span className={clsx('flex-1', isActive && 'font-semibold')}>{item.label}</span>
                  {isActive && (
                    <div className="absolute right-2 w-2 h-2 rounded-full bg-current opacity-60"></div>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Logout Button */}
          {session && (
            <div className="p-4 border-t border-gray-200 dark:border-gray-800">
              <button
                onClick={handleLogout}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 dark:hover:text-red-400 rounded-xl transition-all duration-200 group"
              >
                <ArrowRightOnRectangleIcon className="w-5 h-5 group-hover:scale-110 transition-transform" />
                <span>Sign Out</span>
              </button>
            </div>
          )}
        </div>
      </aside>
    </>
  );
}
