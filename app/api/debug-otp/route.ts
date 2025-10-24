import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/database/mongoose';
import { OTP } from '@/database/models/otp.model';

export async function GET(request: NextRequest) {
    try {
        const mongoose = await connectToDatabase();
        if (!mongoose) {
            return NextResponse.json({ success: false, error: 'Database connection failed' });
        }
        
        // Get all OTPs
        const allOTPs = await OTP.find({}).sort({ createdAt: -1 });
        
        return NextResponse.json({
            success: true,
            count: allOTPs.length,
            otps: allOTPs.map(otp => ({
                id: otp._id,
                email: otp.email,
                otp: otp.otp,
                expiresAt: otp.expiresAt,
                attempts: otp.attempts,
                isUsed: otp.isUsed,
                createdAt: otp.createdAt
            }))
        });
    } catch (error) {
        console.error('Debug OTP API error:', error);
        return NextResponse.json({ 
            success: false, 
            error: 'Internal server error' 
        }, { status: 500 });
    }
}
