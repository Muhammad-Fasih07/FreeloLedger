'use server';

import connectDB from '@/lib/mongodb';
import Project from '@/models/Project';
import { revalidatePath } from 'next/cache';
import { getCurrentCompanyId, requireManager } from '@/lib/utils/server-auth';

export async function createProject(formData: FormData) {
  try {
    await requireManager(); // Only managers and admins can create
    await connectDB();
    const companyId = await getCurrentCompanyId();
    
    const endDateValue = formData.get('endDate') as string;
    
    const project = await Project.create({
      companyId,
      name: formData.get('name') as string,
      clientName: formData.get('clientName') as string,
      startDate: new Date(formData.get('startDate') as string),
      endDate: endDateValue ? new Date(endDateValue) : undefined,
      totalBudget: parseFloat(formData.get('totalBudget') as string),
      currency: formData.get('currency') as string || 'USD',
      description: formData.get('description') as string || undefined,
    });

    revalidatePath('/projects');
    revalidatePath('/dashboard');
    return { success: true, project: JSON.parse(JSON.stringify(project)) };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function getProjects() {
  try {
    await connectDB();
    const companyId = await getCurrentCompanyId();
    const projects = await Project.find({ companyId }).sort({ createdAt: -1 }).lean();
    return { success: true, projects: JSON.parse(JSON.stringify(projects)) };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function getProject(id: string) {
  try {
    await connectDB();
    const companyId = await getCurrentCompanyId();
    const project = await Project.findOne({ _id: id, companyId }).lean();
    if (!project) {
      return { success: false, error: 'Project not found' };
    }
    return { success: true, project: JSON.parse(JSON.stringify(project)) };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function updateProject(id: string, formData: FormData) {
  try {
    await requireManager(); // Only managers and admins can update
    await connectDB();
    const companyId = await getCurrentCompanyId();
    
    const endDateValue = formData.get('endDate') as string;
    
    const project = await Project.findOneAndUpdate(
      { _id: id, companyId },
      {
        name: formData.get('name') as string,
        clientName: formData.get('clientName') as string,
        startDate: new Date(formData.get('startDate') as string),
        endDate: endDateValue ? new Date(endDateValue) : undefined,
        totalBudget: parseFloat(formData.get('totalBudget') as string),
        currency: formData.get('currency') as string || 'USD',
        description: formData.get('description') as string || undefined,
      },
      { new: true }
    ).lean();

    if (!project) {
      return { success: false, error: 'Project not found' };
    }

    revalidatePath('/projects');
    revalidatePath('/dashboard');
    return { success: true, project: JSON.parse(JSON.stringify(project)) };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function deleteProject(id: string) {
  try {
    await requireManager(); // Only managers and admins can delete
    await connectDB();
    const companyId = await getCurrentCompanyId();
    await Project.findOneAndDelete({ _id: id, companyId });
    revalidatePath('/projects');
    revalidatePath('/dashboard');
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
