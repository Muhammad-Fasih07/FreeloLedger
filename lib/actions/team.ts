'use server';

import connectDB from '@/lib/mongodb';
import TeamMember from '@/models/TeamMember';
import { revalidatePath } from 'next/cache';
import { getCurrentCompanyId, requireManager } from '@/lib/utils/server-auth';

export async function createTeamMember(formData: FormData) {
  try {
    await requireManager(); // Only managers and admins can create
    await connectDB();
    const companyId = await getCurrentCompanyId();
    
    const payoutType = formData.get('payoutType') as 'fixed' | 'percentage';
    const teamMember = await TeamMember.create({
      companyId,
      name: formData.get('name') as string,
      role: formData.get('role') as string,
      payoutType,
      payoutAmount: payoutType === 'fixed' 
        ? parseFloat(formData.get('payoutAmount') as string)
        : undefined,
      payoutPercentage: payoutType === 'percentage'
        ? parseFloat(formData.get('payoutPercentage') as string)
        : undefined,
    });

    revalidatePath('/team');
    return { success: true, teamMember: JSON.parse(JSON.stringify(teamMember)) };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function getTeamMembers() {
  try {
    await connectDB();
    const companyId = await getCurrentCompanyId();
    const teamMembers = await TeamMember.find({ companyId }).sort({ createdAt: -1 }).lean();
    return { success: true, teamMembers: JSON.parse(JSON.stringify(teamMembers)) };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function getTeamMember(id: string) {
  try {
    await connectDB();
    const companyId = await getCurrentCompanyId();
    const teamMember = await TeamMember.findOne({ _id: id, companyId }).lean();
    if (!teamMember) {
      return { success: false, error: 'Team member not found' };
    }
    return { success: true, teamMember: JSON.parse(JSON.stringify(teamMember)) };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function updateTeamMember(id: string, formData: FormData) {
  try {
    await requireManager(); // Only managers and admins can update
    await connectDB();
    const companyId = await getCurrentCompanyId();
    const payoutType = formData.get('payoutType') as 'fixed' | 'percentage';
    
    const teamMember = await TeamMember.findOneAndUpdate(
      { _id: id, companyId },
      {
        name: formData.get('name') as string,
        role: formData.get('role') as string,
        payoutType,
        payoutAmount: payoutType === 'fixed' 
          ? parseFloat(formData.get('payoutAmount') as string)
          : undefined,
        payoutPercentage: payoutType === 'percentage'
          ? parseFloat(formData.get('payoutPercentage') as string)
          : undefined,
      },
      { new: true }
    ).lean();

    if (!teamMember) {
      return { success: false, error: 'Team member not found' };
    }

    revalidatePath('/team');
    return { success: true, teamMember: JSON.parse(JSON.stringify(teamMember)) };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function deleteTeamMember(id: string) {
  try {
    await requireManager(); // Only managers and admins can delete
    await connectDB();
    const companyId = await getCurrentCompanyId();
    await TeamMember.findOneAndDelete({ _id: id, companyId });
    revalidatePath('/team');
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
