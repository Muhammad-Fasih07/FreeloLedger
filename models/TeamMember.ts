import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ITeamMember extends Document {
  companyId: mongoose.Types.ObjectId;
  name: string;
  role: string;
  payoutType: 'fixed' | 'percentage';
  payoutAmount?: number; // Fixed amount
  payoutPercentage?: number; // Percentage (0-100)
  createdAt: Date;
  updatedAt: Date;
}

const TeamMemberSchema: Schema = new Schema(
  {
    companyId: {
      type: Schema.Types.ObjectId,
      ref: 'Company',
      required: true,
    },
    name: {
      type: String,
      required: [true, 'Team member name is required'],
      trim: true,
    },
    role: {
      type: String,
      required: [true, 'Role is required'],
      trim: true,
    },
    payoutType: {
      type: String,
      enum: ['fixed', 'percentage'],
      required: [true, 'Payout type is required'],
    },
    payoutAmount: {
      type: Number,
      min: [0, 'Payout amount must be positive'],
      validate: {
        validator: function (this: ITeamMember, value: number | undefined) {
          if (this.payoutType === 'fixed') {
            return value !== undefined && value >= 0;
          }
          return true;
        },
        message: 'Fixed payout amount is required when payout type is fixed',
      },
    },
    payoutPercentage: {
      type: Number,
      min: [0, 'Percentage must be between 0 and 100'],
      max: [100, 'Percentage must be between 0 and 100'],
      validate: {
        validator: function (this: ITeamMember, value: number | undefined) {
          if (this.payoutType === 'percentage') {
            return value !== undefined && value >= 0 && value <= 100;
          }
          return true;
        },
        message: 'Payout percentage is required when payout type is percentage',
      },
    },
  },
  {
    timestamps: true,
  }
);

TeamMemberSchema.index({ companyId: 1 });

const TeamMember: Model<ITeamMember> =
  mongoose.models.TeamMember ||
  mongoose.model<ITeamMember>('TeamMember', TeamMemberSchema);

export default TeamMember;
