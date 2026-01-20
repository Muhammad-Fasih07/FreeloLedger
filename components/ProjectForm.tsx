'use client';

import EnhancedProjectForm from './EnhancedProjectForm';

interface ProjectFormProps {
  project?: any;
}

export default function ProjectForm({ project }: ProjectFormProps) {
  return <EnhancedProjectForm project={project} />;
}
