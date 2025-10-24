import { NextResponse } from 'next/server';
import { auth } from '@/lib/better-auth/auth';

export async function GET() {
  try {
    // Test if Better Auth is properly configured
    const authConfig = {
      hasAuth: !!auth,
      baseURL: process.env.BETTER_AUTH_URL,
      secret: process.env.BETTER_AUTH_SECRET ? 'SET' : 'NOT SET',
    };

    return NextResponse.json({
      status: 'Auth Configuration Check',
      config: authConfig,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    return NextResponse.json({
      status: 'Auth Configuration Error',
      error: error instanceof Error ? error.message : 'Unknown auth error',
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}
