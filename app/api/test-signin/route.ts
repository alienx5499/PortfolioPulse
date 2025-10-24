import { NextRequest, NextResponse } from 'next/server';
import { getAuth } from '@/lib/better-auth/auth';

export async function POST(request: NextRequest) {
    try {
        console.log('Testing sign-in API...');
        
        const { email, password } = await request.json();
        console.log('Received email:', email);
        console.log('Received password:', password);
        
        // Get auth instance
        const auth = await getAuth();
        console.log('Auth instance created successfully');
        
        // Try to sign in
        const result = await auth.api.signInEmail({
            body: { email, password }
        });
        
        console.log('Sign-in result:', result);
        
        return NextResponse.json({
            success: true,
            result: result
        });
        
    } catch (error) {
        console.error('Sign-in API error:', error);
        return NextResponse.json({
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error',
            stack: error instanceof Error ? error.stack : undefined
        }, { status: 500 });
    }
}
