import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IPayment extends Document {
  companyId: mongoose.Types.ObjectId;
  projectId: mongoose.Types.ObjectId;
  amount: number;
  date: Date;
  month: number; // 1-12 (auto-computed from date)
  year: number; // auto-computed from date
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const PaymentSchema: Schema = new Schema(
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
    notes: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

// Compound index for fast monthly queries
PaymentSchema.index({ companyId: 1, month: 1, year: 1 });
PaymentSchema.index({ projectId: 1, year: 1, month: 1 });

const Payment: Model<IPayment> =
  mongoose.models.Payment || mongoose.model<IPayment>('Payment', PaymentSchema);

export default Payment;
