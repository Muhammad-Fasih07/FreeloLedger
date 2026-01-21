'use server';

import connectDB from '@/lib/mongodb';
import Company from '@/models/Company';
import User from '@/models/User';
import { revalidatePath } from 'next/cache';
import { getCurrentUserId, requireAdmin, getCurrentCompanyId as getCompanyId } from '@/lib/utils/server-auth';
import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';
import { sendInviteEmail } from '@/lib/utils/email';

export async function createCompany(formData: FormData) {
  try {
    await connectDB();
    const userId = await getCurrentUserId();

    // Check if user already has a company
    const existingUser = await User.findById(userId);
    if (existingUser?.companyId) {
      return { success: false, error: 'User already belongs to a company' };
    }

    const companyName = formData.get('name') as string;
    if (!companyName) {
      return { success: false, error: 'Company name is required' };
    }

    // Create company
    const company = await Company.create({
      name: companyName,
      ownerId: userId,
    });

    // Update user with companyId and set role to admin
    await User.findByIdAndUpdate(userId, {
      companyId: company._id,
      role: 'admin',
    });

    revalidatePath('/dashboard');
    revalidatePath('/settings');
    return { success: true, company: JSON.parse(JSON.stringify(company)) };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function inviteUser(formData: FormData) {
  try {
    await requireAdmin();
    await connectDB();
    const companyId = await getCompanyId();

    const email = formData.get('email') as string;
    const role = formData.get('role') as 'admin' | 'manager' | 'member';

    if (!email || !role) {
      return { success: false, error: 'Email and role are required' };
    }

    // Get company name for email
    const company = await Company.findById(companyId).lean();
    const companyName = company?.name || 'our company';

    // Check if user already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    let tempPassword: string | null = null;

    if (existingUser) {
      if (existingUser.companyId && existingUser.companyId.toString() === companyId.toString()) {
        return { success: false, error: 'User is already a member of your company' };
      }
      if (existingUser.companyId) {
        return { success: false, error: 'User already belongs to another company' };
      }
      // User exists but no company - update them
      await User.findByIdAndUpdate(existingUser._id, {
        companyId,
        role,
      });
    } else {
      // Create new user with temporary password
      tempPassword = Math.random().toString(36).slice(-12) + Math.random().toString(36).slice(-12).toUpperCase();
      const passwordHash = await bcrypt.hash(tempPassword, 10);
      
      await User.create({
        name: email.split('@')[0], // Use email prefix as name
        email: email.toLowerCase(),
        passwordHash,
        companyId,
        role,
      });
    }

    // Send invite email (only for new users with temp password)
    if (tempPassword) {
      const emailResult = await sendInviteEmail(email, tempPassword, role, companyName);
      if (!emailResult.success) {
        // If email fails, still return success but log the error
        console.error('Failed to send invite email:', emailResult.error);
        // Return temp password in response if email failed (for manual sharing)
        revalidatePath('/settings');
        return { 
          success: true, 
          message: `User invited successfully. Email sending failed. Temporary password: ${tempPassword}`,
          emailSent: false,
          tempPassword, // Include temp password if email failed
        };
      }
    }

    revalidatePath('/settings');
    return { 
      success: true, 
      message: tempPassword 
        ? 'User invited successfully! Invitation email sent.' 
        : 'User added to your company successfully!',
      emailSent: !!tempPassword,
    };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function updateUserRole(userId: string, role: 'admin' | 'manager' | 'member') {
  try {
    await requireAdmin();
    await connectDB();
    const companyId = await getCompanyId();

    const user = await User.findOne({ _id: userId, companyId });
    if (!user) {
      return { success: false, error: 'User not found' };
    }

    await User.findByIdAndUpdate(userId, { role });

    revalidatePath('/settings');
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function getCompanyUsers() {
  try {
    await connectDB();
    const companyId = await getCompanyId();

    const users = await User.find({ companyId })
      .select('name email role createdAt')
      .sort({ createdAt: -1 })
      .lean();

    return { success: true, users: JSON.parse(JSON.stringify(users)) };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

