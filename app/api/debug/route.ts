import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Check environment variables
    const envCheck = {
      NODE_ENV: process.env.NODE_ENV,
      MONGODB_URI: process.env.MONGODB_URI ? 'SET' : 'NOT SET',
      BETTER_AUTH_SECRET: process.env.BETTER_AUTH_SECRET ? 'SET' : 'NOT SET',
      BETTER_AUTH_URL: process.env.BETTER_AUTH_URL,
      NEXT_PUBLIC_BASE_URL: process.env.NEXT_PUBLIC_BASE_URL,
      NODEMAILER_EMAIL: process.env.NODEMAILER_EMAIL ? 'SET' : 'NOT SET',
      GEMINI_API_KEY: process.env.GEMINI_API_KEY ? 'SET' : 'NOT SET',
    };

    return NextResponse.json({
      status: 'Environment Check',
      environment: envCheck,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    return NextResponse.json({
      status: 'Error',
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}
