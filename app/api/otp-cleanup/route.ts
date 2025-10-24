import { NextRequest, NextResponse } from 'next/server';
import { cleanupExpiredOTPs } from '@/lib/actions/otp.actions';

export async function POST(request: NextRequest) {
    try {
        const result = await cleanupExpiredOTPs();
        return NextResponse.json(result);
    } catch (error) {
        console.error('OTP cleanup API error:', error);
        return NextResponse.json({ 
            success: false, 
            error: 'Internal server error' 
        }, { status: 500 });
    }
}
