import { NextRequest, NextResponse } from 'next/server';
import { getAuth } from '@/lib/better-auth/auth';
import { connectToDatabase } from '@/database/mongoose';
import { OTP } from '@/database/models/otp.model';

export async function POST(request: NextRequest) {
    try {
        const { email, otp, newPassword } = await request.json();
        
        console.log('Better Auth password reset for:', email);
        
        // Verify OTP first
        const otpRecord = await OTP.findOne({ 
            email, 
            otp,
            isUsed: false,
            expiresAt: { $gt: new Date() }
        });
        
        if (!otpRecord) {
            return NextResponse.json({ 
                success: false, 
                error: 'Invalid or expired OTP' 
            }, { status: 400 });
        }
        
        // Mark OTP as used
        await OTP.updateOne(
            { _id: otpRecord._id },
            { isUsed: true }
        );
        
        // Get auth instance
        const auth = await getAuth();
        
        // Connect to database
        const mongoose = await connectToDatabase();
        if (!mongoose) {
            return NextResponse.json({ 
                success: false, 
                error: 'Database connection failed' 
            }, { status: 500 });
        }
        
        const db = mongoose.connection.db;
        
        // Find user
        const usersCollection = db.collection('user');
        const user = await usersCollection.findOne({ email });
        
        if (!user) {
            return NextResponse.json({ 
                success: false, 
                error: 'User not found' 
            }, { status: 404 });
        }
        
        // Find the Better Auth account
        const accountsCollection = db.collection('account');
        const account = await accountsCollection.findOne({ userId: user._id });
        
        if (!account) {
            return NextResponse.json({ 
                success: false, 
                error: 'Account not found' 
            }, { status: 404 });
        }
        
        // Use Node.js crypto for password hashing (Better Auth compatible)
        const crypto = require('crypto');
        const salt = crypto.randomBytes(16).toString('hex');
        const hash = crypto.pbkdf2Sync(newPassword, salt, 10000, 64, 'sha512').toString('hex');
        const hashedPassword = `${salt}:${hash}`;
        
        // Update both collections
        await usersCollection.updateOne(
            { email },
            { 
                $set: { 
                    password: newPassword,
                    updatedAt: new Date()
                }
            }
        );
        
        await accountsCollection.updateOne(
            { userId: user._id },
            { 
                $set: { 
                    password: hashedPassword,
                    updatedAt: new Date()
                }
            }
        );
        
        return NextResponse.json({
            success: true,
            message: 'Password reset successfully'
        });
        
    } catch (error) {
        console.error('Better Auth password reset error:', error);
        return NextResponse.json({ 
            success: false, 
            error: 'Internal server error' 
        }, { status: 500 });
    }
}
