'use server';

import connectDB from '@/lib/mongodb';
import Payment from '@/models/Payment';
import { revalidatePath } from 'next/cache';
import mongoose from 'mongoose';
import { getCurrentCompanyId, requireManager } from '@/lib/utils/server-auth';

export async function createPayment(formData: FormData) {
  try {
    await requireManager(); // Only managers and admins can create
    await connectDB();
    const companyId = await getCurrentCompanyId();
    
    const date = new Date(formData.get('date') as string);
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    
    const payment = await Payment.create({
      companyId,
      projectId: formData.get('projectId') as string,
      amount: parseFloat(formData.get('amount') as string),
      date,
      month,
      year,
      notes: formData.get('notes') as string || undefined,
    });

    revalidatePath('/payments');
    revalidatePath('/dashboard');
    return { success: true, payment: JSON.parse(JSON.stringify(payment)) };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function getPayments(month?: number, year?: number, projectId?: string) {
  try {
    await connectDB();
    const companyId = await getCurrentCompanyId();
    const query: any = { companyId };
    
    if (month && year) {
      query.month = month;
      query.year = year;
    }
    
    if (projectId) {
      query.projectId = projectId;
    }

    const payments = await Payment.find(query)
      .populate('projectId', 'name clientName currency')
      .sort({ date: -1 })
      .lean();
    
    return { success: true, payments: JSON.parse(JSON.stringify(payments)) };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function getMonthlyIncome(month: number, year: number) {
  try {
    await connectDB();
    const companyId = await getCurrentCompanyId();
    const result = await Payment.aggregate([
      {
        $match: {
          companyId: companyId,
          month,
          year,
        },
      },
      {
        $group: {
          _id: null,
          total: { $sum: '$amount' },
        },
      },
    ]);

    return { success: true, total: result[0]?.total || 0 };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function getProjectTotalReceived(projectId: string) {
  try {
    await connectDB();
    const companyId = await getCurrentCompanyId();
    const result = await Payment.aggregate([
      {
        $match: { 
          companyId: companyId,
          projectId: new mongoose.Types.ObjectId(projectId) 
        },
      },
      {
        $group: {
          _id: null,
          total: { $sum: '$amount' },
        },
      },
    ]);

    return { success: true, total: result[0]?.total || 0 };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function deletePayment(id: string) {
  try {
    await requireManager(); // Only managers and admins can delete
    await connectDB();
    const companyId = await getCurrentCompanyId();
    await Payment.findOneAndDelete({ _id: id, companyId });
    revalidatePath('/payments');
    revalidatePath('/dashboard');
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
