import mongoose, { Schema, Document, Model } from 'mongoose';

export type ExpenseType = 'team' | 'tools' | 'misc';

export interface IExpense extends Document {
  companyId: mongoose.Types.ObjectId;
  projectId: mongoose.Types.ObjectId;
  teamMemberId?: mongoose.Types.ObjectId; // For team expenses
  type: ExpenseType;
  amount: number;
  date: Date;
  month: number; // 1-12 (auto-computed from date)
  year: number; // auto-computed from date
  description: string;
  createdAt: Date;
  updatedAt: Date;
}

const ExpenseSchema: Schema = new Schema(
  {
    companyId: {
      type: Schema.Types.ObjectId,
      ref: 'Company',
      required: true,
      index: true,
    },
    projectId: {
      type: Schema.Types.ObjectId,
      ref: 'Project',
      required: [true, 'Project ID is required'],
      index: true,
    },
    teamMemberId: {
      type: Schema.Types.ObjectId,
      ref: 'TeamMember',
      index: true,
    },
    type: {
      type: String,
      enum: ['team', 'tools', 'misc'],
      required: [true, 'Expense type is required'],
    },
    amount: {
      type: Number,
      required: [true, 'Amount is required'],
      min: [0, 'Amount must be positive'],
    },
    date: {
      type: Date,
      required: [true, 'Date is required'],
    },
    month: {
      type: Number,
      required: [true, 'Month is required'],
      min: [1, 'Month must be between 1 and 12'],
      max: [12, 'Month must be between 1 and 12'],
    },
    year: {
      type: Number,
      required: [true, 'Year is required'],
      min: [2000, 'Year must be valid'],
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

// Compound index for fast monthly queries
ExpenseSchema.index({ companyId: 1, month: 1, year: 1 });
ExpenseSchema.index({ projectId: 1, year: 1, month: 1 });
ExpenseSchema.index({ teamMemberId: 1, year: 1, month: 1 });

const Expense: Model<IExpense> =
  mongoose.models.Expense || mongoose.model<IExpense>('Expense', ExpenseSchema);

export default Expense;
