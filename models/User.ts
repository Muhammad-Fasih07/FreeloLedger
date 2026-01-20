import mongoose, { Schema, Document, Model } from 'mongoose';

export type UserRole = 'admin' | 'manager' | 'member';

export interface IUser extends Document {
  name: string;
  email: string;
  passwordHash: string;
  companyId: mongoose.Types.ObjectId;
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema: Schema = new Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email'],
    },
    passwordHash: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [6, 'Password must be at least 6 characters'],
    },
    companyId: {
      type: Schema.Types.ObjectId,
      ref: 'Company',
      required: true,
    },
    role: {
      type: String,
      enum: ['admin', 'manager', 'member'],
      default: 'member',
    },
  },
  {
    timestamps: true,
  }
);

// Indexes: email is unique (auto-indexed), companyId needs explicit index for queries
UserSchema.index({ companyId: 1 });

const User: Model<IUser> =
  mongoose.models.User || mongoose.model<IUser>('User', UserSchema);

export default User;
