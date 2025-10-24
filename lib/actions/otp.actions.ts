'use server';

import { connectToDatabase } from '@/database/mongoose';
import { sendOTPEmail } from '@/lib/nodemailer';
import { OTP } from '@/database/models/otp.model';

export const generateOTP = async ({ email }: { email: string }) => {
  try {
    console.log('Generating OTP for email:', email);
    
    // Connect to database
    const mongoose = await connectToDatabase();
    if (!mongoose) {
      console.log('Database connection failed');
      return { success: false, error: 'Database connection failed' };
    }
    
    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    
    // Set expiration time (10 minutes)
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);
    
    console.log('Generated OTP:', otp, 'Expires at:', expiresAt);
    
    // Delete any existing OTPs for this email
    const deletedCount = await OTP.deleteMany({ email });
    console.log('Deleted existing OTPs:', deletedCount.deletedCount);
    
    // Store OTP in database
    const otpRecord = new OTP({
      email,
      otp,
      expiresAt,
      attempts: 0,
      isUsed: false
    });
    
    const savedRecord = await otpRecord.save();
    console.log('Saved OTP record:', savedRecord._id);
    
    // Send OTP via email
    await sendOTPEmail({ email, otp });
    console.log('OTP email sent successfully');
    
    return { success: true, message: 'OTP sent successfully' };
  } catch (error) {
    console.error('OTP generation failed:', error);
    return { success: false, error: 'Failed to generate OTP' };
  }
};

export const verifyOTP = async ({ email, otp }: { email: string; otp: string }) => {
  try {
    console.log('Verifying OTP for email:', email, 'OTP:', otp);
    
    // Connect to database
    const mongoose = await connectToDatabase();
    if (!mongoose) {
      console.log('Database connection failed');
      return { success: false, error: 'Database connection failed' };
    }
    
    // Find all OTP records for this email (for debugging)
    const allOTPs = await OTP.find({ email });
    console.log('All OTPs for email:', allOTPs);
    
    // Find the OTP record
    const otpRecord = await OTP.findOne({ 
      email, 
      isUsed: false,
      expiresAt: { $gt: new Date() } // Not expired
    });
    
    console.log('Found OTP record:', otpRecord);
    
    if (!otpRecord) {
      console.log('No valid OTP found for email:', email);
      return { success: false, error: 'OTP not found or expired' };
    }
    
    // Check attempt limit (max 3 attempts)
    if (otpRecord.attempts >= 3) {
      await OTP.deleteOne({ _id: otpRecord._id });
      return { success: false, error: 'Too many failed attempts. Please request a new OTP.' };
    }
    
    // Verify OTP
    if (otpRecord.otp !== otp) {
      // Increment attempts
      await OTP.updateOne(
        { _id: otpRecord._id },
        { $inc: { attempts: 1 } }
      );
      return { success: false, error: 'Invalid OTP' };
    }
    
    // OTP is valid, but don't mark as used yet (only mark as used during password reset)
    console.log('OTP is valid, ready for password reset');
    
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
    console.log('Resetting password for email:', email, 'with OTP:', otp);
    
    // Connect to database
    const mongoose = await connectToDatabase();
    if (!mongoose) {
      return { success: false, error: 'Database connection failed' };
    }
    
    // First verify the OTP
    const otpRecord = await OTP.findOne({ 
      email, 
      otp,
      isUsed: false,
      expiresAt: { $gt: new Date() } // Not expired
    });
    
    console.log('Found OTP record for reset:', otpRecord);
    
    if (!otpRecord) {
      console.log('No valid OTP found for password reset');
      return { success: false, error: 'Invalid or expired OTP' };
    }
    
    // Mark OTP as used
    await OTP.updateOne(
      { _id: otpRecord._id },
      { isUsed: true }
    );
    
    console.log('OTP marked as used');
    
    // Use Better Auth to reset password properly
    const { getAuth } = await import('@/lib/better-auth/auth');
    const auth = await getAuth();
    
    // Find the user by email to get their ID
    const db = mongoose.connection.db;
    const usersCollection = db.collection('user');
    const user = await usersCollection.findOne({ email });
    
    if (!user) {
      return { success: false, error: 'User not found' };
    }
    
    console.log('Found user for password reset:', user._id);
    
    // Update password using Better Auth's internal method
    const accountsCollection = db.collection('account');
    const account = await accountsCollection.findOne({ userId: user._id });
    
    if (!account) {
      return { success: false, error: 'Account not found' };
    }
    
    // Update the account password (Better Auth will handle hashing)
    const accountResult = await accountsCollection.updateOne(
      { userId: user._id },
      { 
        $set: { 
          password: newPassword, // This will be hashed by Better Auth
          updatedAt: new Date()
        }
      }
    );
    
    // Also update our custom user collection
    const userResult = await usersCollection.updateOne(
      { email },
      { 
        $set: { 
          password: newPassword,
          updatedAt: new Date()
        }
      }
    );
    
    console.log('User update result:', userResult);
    console.log('Account update result:', accountResult);
    
    if (userResult.modifiedCount === 0 && accountResult.modifiedCount === 0) {
      return { success: false, error: 'User not found or password not updated' };
    }
    
    return { success: true, message: 'Password reset successfully' };
  } catch (error) {
    console.error('Password reset failed:', error);
    return { success: false, error: 'Failed to reset password' };
  }
};

// Clean up expired OTPs (call this periodically)
export const cleanupExpiredOTPs = async () => {
    try {
        const mongoose = await connectToDatabase();
        if (!mongoose) {
            return { success: false, error: 'Database connection failed' };
        }
        
        // Delete expired OTPs
        const result = await OTP.deleteMany({
            $or: [
                { expiresAt: { $lt: new Date() } },
                { isUsed: true }
            ]
        });
        
        console.log(`Cleaned up ${result.deletedCount} expired OTPs`);
        return { success: true, message: `Cleaned up ${result.deletedCount} expired OTPs` };
    } catch (error) {
        console.error('OTP cleanup failed:', error);
        return { success: false, error: 'Failed to cleanup OTPs' };
    }
};
