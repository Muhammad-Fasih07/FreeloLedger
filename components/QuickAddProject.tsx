'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { PlusIcon, XMarkIcon } from '@heroicons/react/24/outline';
import EnhancedProjectForm from './EnhancedProjectForm';

export default function QuickAddProject() {
  const router = useRouter();
  const { data: session } = useSession();
  const [isOpen, setIsOpen] = useState(false);

  const role = (session?.user as any)?.role;
  const canEdit = role === 'admin' || role === 'manager';

  if (!canEdit) {
    return null;
  }

  const handleSuccess = () => {
    setIsOpen(false);
    router.refresh();
  };

  return (
    <div className="mb-6">
      {!isOpen ? (
        <button
          onClick={() => setIsOpen(true)}
          className="flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors font-medium shadow-sm"
        >
          <PlusIcon className="w-5 h-5" />
          Add New Project
        </button>
      ) : (
        <div className="bg-card-light dark:bg-card-dark rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-text-light dark:text-text-dark">Add New Project</h3>
            <button
              onClick={() => setIsOpen(false)}
              className="p-2 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
              aria-label="Close"
            >
              <XMarkIcon className="w-5 h-5" />
            </button>
          </div>
          <EnhancedProjectForm />
        </div>
      )}
    </div>
  );
}
