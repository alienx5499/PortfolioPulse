import { NextRequest, NextResponse } from 'next/server';
import { verifyOTP } from '@/lib/actions/otp.actions';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        console.log('Verify OTP API received:', body);
        
        const { email, otp } = body;
        console.log('Extracted email:', email, 'OTP:', otp);
        
        if (!email || !otp) {
            console.log('Missing email or OTP - email:', email, 'otp:', otp);
            return NextResponse.json({ 
                success: false, 
                error: 'Email and OTP are required' 
            }, { status: 400 });
        }
        
        const result = await verifyOTP({ email, otp });
        return NextResponse.json(result);
    } catch (error) {
        console.error('Verify OTP API error:', error);
        return NextResponse.json({ 
            success: false, 
            error: 'Internal server error' 
        }, { status: 500 });
    }
}
