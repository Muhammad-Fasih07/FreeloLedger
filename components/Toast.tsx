'use client';

import { useEffect, useState } from 'react';
import { CheckCircleIcon, XCircleIcon, XMarkIcon } from '@heroicons/react/24/outline';

export type ToastType = 'success' | 'error' | 'info';

interface Toast {
  id: string;
  message: string;
  type: ToastType;
}

let toastListeners: ((toasts: Toast[]) => void)[] = [];
let toasts: Toast[] = [];

function addToast(message: string, type: ToastType = 'info') {
  const id = Math.random().toString(36).substring(7);
  const newToast: Toast = { id, message, type };
  toasts = [...toasts, newToast];
  toastListeners.forEach((listener) => listener(toasts));

  // Auto remove after 4 seconds
  setTimeout(() => {
    removeToast(id);
  }, 4000);
}

function removeToast(id: string) {
  toasts = toasts.filter((t) => t.id !== id);
  toastListeners.forEach((listener) => listener(toasts));
}

export function showToast(message: string, type: ToastType = 'info') {
  addToast(message, type);
}

export function useToast() {
  const [toastList, setToastList] = useState<Toast[]>(toasts);

  useEffect(() => {
    const listener = (newToasts: Toast[]) => {
      setToastList(newToasts);
    };
    toastListeners.push(listener);
    setToastList(toasts);

    return () => {
      toastListeners = toastListeners.filter((l) => l !== listener);
    };
  }, []);

  return { toasts: toastList, showToast, removeToast };
}

export default function ToastContainer() {
  const { toasts, removeToast } = useToast();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 z-[9999] space-y-2 max-w-md w-full md:w-auto">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`
            flex items-start gap-3 p-4 rounded-lg shadow-lg border backdrop-blur-sm
            transform transition-all duration-300 ease-in-out
            animate-[slideDown_0.3s_ease-out_forwards]
            ${
              toast.type === 'success'
                ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800 text-green-800 dark:text-green-200'
                : toast.type === 'error'
                ? 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800 text-red-800 dark:text-red-200'
                : 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800 text-blue-800 dark:text-blue-200'
            }
          `}
        >
          {toast.type === 'success' ? (
            <CheckCircleIcon className="w-5 h-5 flex-shrink-0 mt-0.5" />
          ) : toast.type === 'error' ? (
            <XCircleIcon className="w-5 h-5 flex-shrink-0 mt-0.5" />
          ) : null}
          <p className="flex-1 text-sm font-medium">{toast.message}</p>
          <button
            onClick={() => removeToast(toast.id)}
            className="flex-shrink-0 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
            aria-label="Close"
          >
            <XMarkIcon className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  );
}
