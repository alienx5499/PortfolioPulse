import { NextRequest, NextResponse } from 'next/server';
import { resetPasswordWithOTP } from '@/lib/actions/otp.actions';

export async function POST(request: NextRequest) {
    try {
        const { email, otp, newPassword } = await request.json();
        
        if (!email || !otp || !newPassword) {
            return NextResponse.json({ 
                success: false, 
                error: 'Email, OTP, and new password are required' 
            }, { status: 400 });
        }
        
        const result = await resetPasswordWithOTP({ email, otp, newPassword });
        return NextResponse.json(result);
    } catch (error) {
        console.error('Reset password OTP API error:', error);
        return NextResponse.json({ 
            success: false, 
            error: 'Internal server error' 
        }, { status: 500 });
    }
}
