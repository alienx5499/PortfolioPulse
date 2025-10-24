import mongoose, { Schema, Document } from 'mongoose';

export interface IOTP extends Document {
  email: string;
  otp: string;
  expiresAt: Date;
  attempts: number;
  createdAt: Date;
  isUsed: boolean;
}

const OTPSchema = new Schema<IOTP>({
  email: {
    type: String,
    required: true,
    lowercase: true,
    trim: true,
    index: true
  },
  otp: {
    type: String,
    required: true,
    length: 6
  },
  expiresAt: {
    type: Date,
    required: true,
    index: { expireAfterSeconds: 0 } // MongoDB TTL index
  },
  attempts: {
    type: Number,
    default: 0,
    max: 3
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  isUsed: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Create TTL index for automatic cleanup
OTPSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export const OTP = mongoose.models.OTP || mongoose.model<IOTP>('OTP', OTPSchema);
