import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IProject extends Document {
  companyId: mongoose.Types.ObjectId;
  name: string;
  clientName: string;
  startDate: Date;
  endDate?: Date;
  totalBudget: number;
  currency: string; // USD, EUR, GBP, etc.
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}

const ProjectSchema: Schema = new Schema(
  {
    companyId: {
      type: Schema.Types.ObjectId,
      ref: 'Company',
      required: true,
      index: true,
    },
    name: {
      type: String,
      required: [true, 'Project name is required'],
      trim: true,
    },
    clientName: {
      type: String,
      required: [true, 'Client name is required'],
      trim: true,
    },
    startDate: {
      type: Date,
      required: [true, 'Start date is required'],
    },
    endDate: {
      type: Date,
    },
    totalBudget: {
      type: Number,
      required: [true, 'Total budget is required'],
      min: [0, 'Amount must be positive'],
    },
    currency: {
      type: String,
      required: [true, 'Currency is required'],
      default: 'USD',
      enum: ['USD', 'EUR', 'GBP', 'INR', 'CAD', 'AUD', 'JPY', 'CNY', 'AED', 'SAR', 'PKR', 'BDT', 'LKR', 'NPR', 'MYR', 'SGD', 'THB', 'PHP', 'IDR', 'VND', 'KRW', 'HKD', 'NZD', 'ZAR', 'BRL', 'MXN', 'CHF', 'SEK', 'NOK', 'DKK', 'PLN', 'CZK', 'HUF', 'RON', 'BGN', 'HRK', 'RUB', 'TRY', 'ILS', 'EGP', 'NGN', 'KES', 'GHS', 'UGX', 'TZS', 'ETB', 'MAD', 'TND', 'DZD', 'SDG', 'SSP', 'ZWL', 'XOF', 'XAF', 'XPF', 'ANG', 'AWG', 'BBD', 'BMD', 'BZD', 'BSD', 'BWP', 'BND', 'KHR', 'KYD', 'FJD', 'GYD', 'HTG', 'JMD', 'KZT', 'KWD', 'KGS', 'LAK', 'LBP', 'LRD', 'LSL', 'MOP', 'MUR', 'MVR', 'MWK', 'MZN', 'NAD', 'NIO', 'OMR', 'PAB', 'PGK', 'PYG', 'QAR', 'RWF', 'SBD', 'SCR', 'SLL', 'SOS', 'SRD', 'STN', 'SYP', 'SZL', 'TJS', 'TMT', 'TOP', 'TTD', 'TWD', 'UAH', 'UYU', 'UZS', 'VUV', 'WST', 'XCD', 'YER', 'ZMW', 'BTC', 'ETH'],
    },
    description: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

// Index for faster queries
ProjectSchema.index({ companyId: 1 });
ProjectSchema.index({ createdAt: -1 });

const Project: Model<IProject> =
  mongoose.models.Project || mongoose.model<IProject>('Project', ProjectSchema);

export default Project;
