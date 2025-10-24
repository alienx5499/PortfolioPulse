import { NextRequest, NextResponse } from 'next/server';
import { generateOTP, verifyOTP, resetPasswordWithOTP } from '@/lib/actions/otp.actions';

export async function POST(request: NextRequest) {
    try {
        const { action, email, otp, newPassword } = await request.json();
        
        switch (action) {
            case 'generate':
                const generateResult = await generateOTP({ email });
                return NextResponse.json(generateResult);
                
            case 'verify':
                const verifyResult = await verifyOTP({ email, otp });
                return NextResponse.json(verifyResult);
                
            case 'reset':
                const resetResult = await resetPasswordWithOTP({ email, otp, newPassword });
                return NextResponse.json(resetResult);
                
            default:
                return NextResponse.json({ success: false, error: 'Invalid action' }, { status: 400 });
        }
    } catch (error) {
        console.error('OTP API error:', error);
        return NextResponse.json({ 
            success: false, 
            error: 'Internal server error' 
        }, { status: 500 });
    }
}

