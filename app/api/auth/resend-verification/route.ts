import { NextRequest, NextResponse } from 'next/server';
import { sendVerificationEmail } from '@/lib/nodemailer';
import { connectToDatabase } from '@/database/mongoose';

export async function POST(request: NextRequest) {
    try {
        const { email } = await request.json();
        
        if (!email) {
            return NextResponse.json({ 
                success: false, 
                error: 'Email is required' 
            }, { status: 400 });
        }
        
        console.log('Resending verification email for:', email);
        
        // Connect to database to get user info
        const mongoose = await connectToDatabase();
        if (!mongoose) {
            return NextResponse.json({ 
                success: false, 
                error: 'Database connection failed' 
            }, { status: 500 });
        }
        
        const db = mongoose.connection.db;
        const usersCollection = db.collection('user');
        
        // Find user by email
        const user = await usersCollection.findOne({ email });
        
        if (!user) {
            return NextResponse.json({
                success: false,
                error: 'User not found'
            }, { status: 404 });
        }
        
        // Generate a new verification URL using localhost for development
        const baseUrl = process.env.NODE_ENV === 'production' 
            ? (process.env.BETTER_AUTH_URL || 'https://portfoliopulse.vercel.app')
            : 'http://localhost:3000';
        const verificationUrl = `${baseUrl}/verify-email?token=resend_${Date.now()}&email=${encodeURIComponent(email)}`;
        
        // Send verification email
        await sendVerificationEmail({
            email: user.email,
            name: user.name,
            verificationUrl: verificationUrl
        });
        
        console.log('Verification email sent successfully');
        
        return NextResponse.json({
            success: true,
            message: 'Verification email sent successfully'
        });
        
    } catch (error) {
        console.error('Resend verification email error:', error);
        return NextResponse.json({ 
            success: false, 
            error: 'Failed to send verification email' 
        }, { status: 500 });
    }
}
