import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/better-auth/auth';

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const token = url.searchParams.get('token');
    
    console.log('Reset password test - Token:', token);
    console.log('Reset password test - URL:', request.url);
    
    // Test if we can access the auth instance
    const authInfo = {
      hasAuth: !!auth,
      baseURL: process.env.BETTER_AUTH_URL,
      secret: process.env.BETTER_AUTH_SECRET ? 'SET' : 'NOT SET',
    };
    
    return NextResponse.json({
      status: 'Reset Password Test',
      token: token,
      authInfo: authInfo,
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('Reset password test error:', error);
    return NextResponse.json({
      status: 'Reset Password Test Error',
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}
