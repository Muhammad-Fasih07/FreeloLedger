'use server';

import connectDB from '@/lib/mongodb';
import Payment from '@/models/Payment';
import Expense from '@/models/Expense';
import Project from '@/models/Project';
import TeamMember from '@/models/TeamMember';
import { getCurrentCompanyId } from '@/lib/utils/server-auth';
import mongoose from 'mongoose';

export async function getDashboardData(month: number, year: number) {
  try {
    await connectDB();
    const companyId = await getCurrentCompanyId();

    // Get monthly income
    const incomeResult = await Payment.aggregate([
      {
        $match: { companyId: companyId, month, year },
      },
      {
        $group: {
          _id: null,
          total: { $sum: '$amount' },
        },
      },
    ]);
    const totalIncome = incomeResult[0]?.total || 0;

    // Get monthly expenses
    const expenseResult = await Expense.aggregate([
      {
        $match: { companyId: companyId, month, year },
      },
      {
        $group: {
          _id: null,
          total: { $sum: '$amount' },
        },
      },
    ]);
    const totalExpenses = expenseResult[0]?.total || 0;

    // Get active projects count
    const activeProjectsCount = await Project.countDocuments({ companyId });

    // Optimize: Run project profitability and expenses queries in parallel
    const [projectProfitability, projectExpenses] = await Promise.all([
      Payment.aggregate([
        {
          $match: { companyId: companyId, month, year },
        },
        {
          $group: {
            _id: '$projectId',
            income: { $sum: '$amount' },
          },
        },
        {
          $lookup: {
            from: 'projects',
            localField: '_id',
            foreignField: '_id',
            as: 'project',
          },
        },
        {
          $unwind: '$project',
        },
      ]),
      Expense.aggregate([
        {
          $match: { companyId: companyId, month, year },
        },
        {
          $group: {
            _id: '$projectId',
            expenses: { $sum: '$amount' },
          },
        },
      ]),
    ]);

    // Combine income and expenses per project
    const projectData = projectProfitability.map((item) => {
      const expenses = projectExpenses.find(
        (e) => e._id.toString() === item._id.toString()
      )?.expenses || 0;
      return {
        projectId: item._id,
        projectName: item.project.name,
        income: item.income,
        expenses,
        profit: item.income - expenses,
      };
    });

    // Get monthly income/expense trend (last 6 months)
    const months = [];
    for (let i = 5; i >= 0; i--) {
      const date = new Date(year, month - 1 - i, 1);
      months.push({
        month: date.getMonth() + 1,
        year: date.getFullYear(),
        label: date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
      });
    }

    // Optimize: Run parallel queries for better performance
    const trendData = await Promise.all(
      months.map(async (m) => {
        // Run income and expense queries in parallel
        const [income, expenses] = await Promise.all([
          Payment.aggregate([
            { $match: { companyId: companyId, month: m.month, year: m.year } },
            { $group: { _id: null, total: { $sum: '$amount' } } },
          ]),
          Expense.aggregate([
            { $match: { companyId: companyId, month: m.month, year: m.year } },
            { $group: { _id: null, total: { $sum: '$amount' } } },
          ]),
        ]);

        return {
          month: m.label,
          income: income[0]?.total || 0,
          expenses: expenses[0]?.total || 0,
        };
      })
    );

    // Get team payout distribution for the month
    const teamPayouts = await Expense.aggregate([
      {
        $match: {
          companyId: companyId,
          month,
          year,
          type: 'team',
        },
      },
      {
        $group: {
          _id: '$teamMemberId',
          total: { $sum: '$amount' },
        },
      },
      {
        $lookup: {
          from: 'teammembers',
          localField: '_id',
          foreignField: '_id',
          as: 'teamMember',
        },
      },
      {
        $unwind: '$teamMember',
      },
    ]);

    const teamPayoutData = teamPayouts.map((item) => ({
      name: item.teamMember.name,
      amount: item.total,
    }));

    return {
      success: true,
      data: {
        totalIncome,
        totalExpenses,
        netProfit: totalIncome - totalExpenses,
        activeProjectsCount,
        projectProfitability: projectData,
        trendData,
        teamPayoutDistribution: teamPayoutData,
      },
    };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

// Get detailed project data with monthly breakdowns
export async function getProjectDetails(projectId: string, month?: number, year?: number) {
  try {
    await connectDB();
    const companyId = await getCurrentCompanyId();

    const project = await Project.findOne({ _id: projectId, companyId }).lean();
    if (!project) {
      return { success: false, error: 'Project not found' };
    }

    // Get all payments for this project
    const paymentsQuery: any = { companyId, projectId: new mongoose.Types.ObjectId(projectId) };
    if (month && year) {
      paymentsQuery.month = month;
      paymentsQuery.year = year;
    }
    
    const payments = await Payment.find(paymentsQuery)
      .sort({ date: -1 })
      .lean();

    // Get all expenses for this project
    const expensesQuery: any = { companyId, projectId: new mongoose.Types.ObjectId(projectId) };
    if (month && year) {
      expensesQuery.month = month;
      expensesQuery.year = year;
    }
    
    const expenses = await Expense.find(expensesQuery)
      .populate('teamMemberId', 'name role')
      .sort({ date: -1 })
      .lean();

    // Calculate totals
    const totalReceived = payments.reduce((sum, p) => sum + p.amount, 0);
    const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);
    const netProfit = totalReceived - totalExpenses;
    const remaining = (project.totalBudget || 0) - totalReceived;

    // Monthly breakdown
    const monthlyBreakdown = await Payment.aggregate([
      {
        $match: { companyId, projectId: new mongoose.Types.ObjectId(projectId) },
      },
      {
        $group: {
          _id: { month: '$month', year: '$year' },
          total: { $sum: '$amount' },
        },
      },
      {
        $sort: { '_id.year': 1, '_id.month': 1 },
      },
    ]);

    // Team member payouts for this project
    const teamPayouts = await Expense.aggregate([
      {
        $match: {
          companyId,
          projectId: new mongoose.Types.ObjectId(projectId),
          type: 'team',
        },
      },
      {
        $group: {
          _id: '$teamMemberId',
          total: { $sum: '$amount' },
          count: { $sum: 1 },
        },
      },
      {
        $lookup: {
          from: 'teammembers',
          localField: '_id',
          foreignField: '_id',
          as: 'teamMember',
        },
      },
      {
        $unwind: '$teamMember',
      },
    ]);

    return {
      success: true,
      data: {
        project,
        payments,
        expenses,
        totalReceived,
        totalExpenses,
        netProfit,
        remaining,
        monthlyBreakdown,
        teamPayouts: teamPayouts.map((tp) => ({
          teamMemberId: tp._id,
          name: tp.teamMember.name,
          role: tp.teamMember.role,
          totalPaid: tp.total,
          paymentCount: tp.count,
        })),
      },
    };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
