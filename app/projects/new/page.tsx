import ProjectForm from '@/components/ProjectForm';

export default function NewProjectPage() {
  return (
    <div className="p-4 md:p-8">
      <div className="max-w-2xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-text-light dark:text-text-dark">New Project</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Create a new project</p>
        </div>
        <div className="bg-card-light dark:bg-card-dark rounded-lg shadow-sm p-6 border border-gray-200 dark:border-gray-700">
          <ProjectForm />
        </div>
      </div>
    </div>
  );
}
