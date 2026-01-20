'use server';

import connectDB from '@/lib/mongodb';
import Company from '@/models/Company';
import User from '@/models/User';
import { revalidatePath } from 'next/cache';
import { getCurrentUserId, requireAdmin, getCurrentCompanyId as getCompanyId } from '@/lib/utils/server-auth';
import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';

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

    // Check if user already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      if (existingUser.companyId) {
        return { success: false, error: 'User already belongs to a company' };
      }
      // User exists but no company - update them
      await User.findByIdAndUpdate(existingUser._id, {
        companyId,
        role,
      });
    } else {
      // Create new user with temporary password
      const tempPassword = Math.random().toString(36).slice(-12);
      const passwordHash = await bcrypt.hash(tempPassword, 10);
      
      await User.create({
        name: email.split('@')[0], // Use email prefix as name
        email: email.toLowerCase(),
        passwordHash,
        companyId,
        role,
      });
      
      // TODO: Send email with invite link and temp password
      // For now, return temp password (in production, send via email)
      return { 
        success: true, 
        message: 'User invited successfully',
        tempPassword, // Remove in production
      };
    }

    revalidatePath('/settings');
    return { success: true, message: 'User invited successfully' };
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

