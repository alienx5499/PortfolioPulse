'use server';

import { connectToDatabase } from '@/database/mongoose';
import { sendOTPEmail } from '@/lib/nodemailer';
import crypto from 'crypto';

interface OTPData {
  email: string;
  otp: string;
  expiresAt: Date;
  attempts: number;
}

// Store OTPs in memory (in production, use Redis or database)
const otpStore = new Map<string, OTPData>();

export const generateOTP = async ({ email }: { email: string }) => {
  try {
    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    
    // Set expiration time (10 minutes)
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);
    
    // Store OTP data
    const otpData: OTPData = {
      email,
      otp,
      expiresAt,
      attempts: 0
    };
    
    otpStore.set(email, otpData);
    
    // Send OTP via email
    await sendOTPEmail({ email, otp });
    
    return { success: true, message: 'OTP sent successfully' };
  } catch (error) {
    console.error('OTP generation failed:', error);
    return { success: false, error: 'Failed to generate OTP' };
  }
};

export const verifyOTP = async ({ email, otp }: { email: string; otp: string }) => {
  try {
    const storedOTP = otpStore.get(email);
    
    if (!storedOTP) {
      return { success: false, error: 'OTP not found or expired' };
    }
    
    // Check if OTP is expired
    if (new Date() > storedOTP.expiresAt) {
      otpStore.delete(email);
      return { success: false, error: 'OTP has expired' };
    }
    
    // Check attempt limit (max 3 attempts)
    if (storedOTP.attempts >= 3) {
      otpStore.delete(email);
      return { success: false, error: 'Too many failed attempts. Please request a new OTP.' };
    }
    
    // Verify OTP
    if (storedOTP.otp !== otp) {
      storedOTP.attempts += 1;
      otpStore.set(email, storedOTP);
      return { success: false, error: 'Invalid OTP' };
    }
    
    // OTP is valid, remove it from store
    otpStore.delete(email);
    
    return { success: true, message: 'OTP verified successfully' };
  } catch (error) {
    console.error('OTP verification failed:', error);
    return { success: false, error: 'Failed to verify OTP' };
  }
};

export const resetPasswordWithOTP = async ({ 
  email, 
  otp, 
  newPassword 
}: { 
  email: string; 
  otp: string; 
  newPassword: string; 
}) => {
  try {
    // First verify the OTP
    const otpVerification = await verifyOTP({ email, otp });
    
    if (!otpVerification.success) {
      return { success: false, error: otpVerification.error };
    }
    
    // Connect to database
    const mongoose = await connectToDatabase();
    if (!mongoose) {
      return { success: false, error: 'Database connection failed' };
    }
    
    const db = mongoose.connection.db;
    if (!db) {
      return { success: false, error: 'Database not found' };
    }
    
    // Update password in database
    const usersCollection = db.collection('user');
    const result = await usersCollection.updateOne(
      { email },
      { 
        $set: { 
          password: newPassword, // In production, hash this password
          updatedAt: new Date()
        }
      }
    );
    
    if (result.modifiedCount === 0) {
      return { success: false, error: 'User not found or password not updated' };
    }
    
    return { success: true, message: 'Password reset successfully' };
  } catch (error) {
    console.error('Password reset failed:', error);
    return { success: false, error: 'Failed to reset password' };
  }
};

// Clean up expired OTPs (call this periodically)
export const cleanupExpiredOTPs = () => {
  const now = new Date();
  for (const [email, otpData] of otpStore.entries()) {
    if (now > otpData.expiresAt) {
      otpStore.delete(email);
    }
  }
};
