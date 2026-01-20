'use server';

import connectDB from '@/lib/mongodb';
import Expense from '@/models/Expense';
import { revalidatePath } from 'next/cache';
import { getCurrentCompanyId, requireManager } from '@/lib/utils/server-auth';

export async function createExpense(formData: FormData) {
  try {
    await requireManager(); // Only managers and admins can create
    await connectDB();
    const companyId = await getCurrentCompanyId();
    
    const date = new Date(formData.get('date') as string);
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    
    const expenseType = formData.get('type') as 'team' | 'tools' | 'misc';
    const teamMemberId = expenseType === 'team' 
      ? (formData.get('teamMemberId') as string || undefined)
      : undefined;
    
    const expense = await Expense.create({
      companyId,
      projectId: formData.get('projectId') as string,
      teamMemberId,
      type: expenseType,
      amount: parseFloat(formData.get('amount') as string),
      date,
      month,
      year,
      description: formData.get('description') as string,
    });

    revalidatePath('/expenses');
    revalidatePath('/dashboard');
    return { success: true, expense: JSON.parse(JSON.stringify(expense)) };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function getExpenses(month?: number, year?: number, projectId?: string) {
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

    const expenses = await Expense.find(query)
      .populate('projectId', 'name clientName currency')
      .populate('teamMemberId', 'name role')
      .sort({ date: -1 })
      .lean();
    
    return { success: true, expenses: JSON.parse(JSON.stringify(expenses)) };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function getMonthlyExpenses(month: number, year: number) {
  try {
    await connectDB();
    const companyId = await getCurrentCompanyId();
    const result = await Expense.aggregate([
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

export async function deleteExpense(id: string) {
  try {
    await requireManager(); // Only managers and admins can delete
    await connectDB();
    const companyId = await getCurrentCompanyId();
    await Expense.findOneAndDelete({ _id: id, companyId });
    revalidatePath('/expenses');
    revalidatePath('/dashboard');
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
