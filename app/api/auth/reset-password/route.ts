import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/better-auth/auth';

export async function GET(request: NextRequest) {
  try {
    // Handle reset password GET request
    const url = new URL(request.url);
    const token = url.searchParams.get('token');
    const callbackURL = url.searchParams.get('callbackURL');
    
    if (!token) {
      return NextResponse.json({ error: 'Token is required' }, { status: 400 });
    }

    // Redirect to the reset password page with the token
    const resetUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/reset-password?token=${token}`;
    return NextResponse.redirect(resetUrl);
    
  } catch (error) {
    console.error('Reset password error:', error);
    return NextResponse.json(
      { error: 'Internal server error' }, 
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    // Handle reset password POST request
    const body = await request.json();
    const { token, password } = body;
    
    if (!token || !password) {
      return NextResponse.json({ error: 'Token and password are required' }, { status: 400 });
    }

    // Use Better Auth to reset the password
    const result = await auth.api.resetPassword({
      body: { token, newPassword: password }
    });

    return NextResponse.json({ success: true, data: result });
    
  } catch (error) {
    console.error('Reset password POST error:', error);
    return NextResponse.json(
      { error: 'Failed to reset password' }, 
      { status: 500 }
    );
  }
}
