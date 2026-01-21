'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';

export default function SplashScreen() {
  const [isLoading, setIsLoading] = useState(true);
  const [mounted, setMounted] = useState(false);
  const [hasShown, setHasShown] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setMounted(true);
    
    // Check if splash has been shown in this session
    const splashShown = sessionStorage.getItem('splashShown');
    if (splashShown === 'true') {
      setHasShown(true);
      setIsLoading(false);
      return;
    }
  }, []);

  useEffect(() => {
    if (!mounted) return;

    // Show splash screen on initial load (including login/signup pages)
    if (!hasShown) {
      const timer = setTimeout(() => {
        setIsLoading(false);
        setHasShown(true);
        sessionStorage.setItem('splashShown', 'true');
      }, 2000); // Show for 2 seconds

      // Also hide when page is fully loaded
      if (typeof window !== 'undefined' && document.readyState === 'complete') {
        setTimeout(() => {
          setIsLoading(false);
          setHasShown(true);
          sessionStorage.setItem('splashShown', 'true');
        }, 2000);
      } else if (typeof window !== 'undefined') {
        window.addEventListener('load', () => {
          setTimeout(() => {
            setIsLoading(false);
            setHasShown(true);
            sessionStorage.setItem('splashShown', 'true');
          }, 2000);
        });
      }

      return () => {
        clearTimeout(timer);
        if (typeof window !== 'undefined') {
          window.removeEventListener('load', () => {
            setIsLoading(false);
            setHasShown(true);
            sessionStorage.setItem('splashShown', 'true');
          });
        }
      };
    } else {
      setIsLoading(false);
    }
  }, [mounted, hasShown]);

  // Don't render until mounted (SSR safety)
  if (!mounted) {
    return null;
  }

  // Don't show if already shown in this session
  if (hasShown || !isLoading) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-900 dark:to-gray-800 transition-opacity duration-500">
      <div className="flex flex-col items-center justify-center space-y-6">
        {/* Favicon/Logo */}
        <div className="relative">
          <img
            src="/favicon.png"
            alt="FreeloLedger"
            className="h-20 w-20 md:h-24 md:w-24 object-contain animate-pulse"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.style.display = 'none';
            }}
          />
          <div className="absolute inset-0 bg-blue-500/20 rounded-full blur-2xl animate-ping" />
        </div>
        
        {/* Brand Name */}
        <div className="text-center">
          <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 bg-clip-text text-transparent animate-fade-in">
            FreeloLedger
          </h1>
          <p className="text-sm md:text-base text-gray-600 dark:text-gray-400 mt-2 animate-fade-in-delay">
            Company Finance Tracker
          </p>
        </div>

        {/* Loading Spinner */}
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
          <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
          <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
        </div>
      </div>
    </div>
  );
}
