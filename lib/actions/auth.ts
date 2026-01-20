'use server';

import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import Company from '@/models/Company';
import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';

export async function signup(formData: FormData) {
  try {
    await connectDB();

    const name = formData.get('name') as string;
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    const companyName = formData.get('companyName') as string;
    const inviteToken = formData.get('inviteToken') as string;

    if (!name || !email || !password) {
      return { success: false, error: 'Name, email, and password are required' };
    }

    if (password.length < 6) {
      return { success: false, error: 'Password must be at least 6 characters' };
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return { success: false, error: 'Email already registered' };
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 10);

    let companyId: mongoose.Types.ObjectId;
    let role: 'admin' | 'manager' | 'member' = 'member';

    if (inviteToken) {
      // TODO: Validate invite token and get companyId from token
      // For now, this is a placeholder
      return { success: false, error: 'Invite token validation not implemented yet' };
    } else if (companyName) {
      // Create user first (temporarily without companyId)
      const tempUser = await User.create({
        name,
        email: email.toLowerCase(),
        passwordHash,
        companyId: new mongoose.Types.ObjectId(), // Temporary, will update
        role: 'admin',
      });

      // Create company with user as owner
      const company = await Company.create({
        name: companyName,
        ownerId: tempUser._id,
      });

      // Update user with actual companyId
      await User.findByIdAndUpdate(tempUser._id, { companyId: company._id });

      const finalUser = await User.findById(tempUser._id).lean();
      
      return {
        success: true,
        user: {
          id: finalUser!._id.toString(),
          name: finalUser!.name,
          email: finalUser!.email,
          role: finalUser!.role,
          companyId: company._id.toString(),
        },
      };
    } else {
      return { success: false, error: 'Either company name or invite token is required' };
    }
  } catch (error: any) {
    return { success: false, error: error.message || 'An error occurred' };
  }
}
