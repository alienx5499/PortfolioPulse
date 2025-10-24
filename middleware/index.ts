import { NextRequest, NextResponse } from "next/server";
import { getSessionCookie } from "better-auth/cookies";

export async function middleware(request: NextRequest) {
    const sessionCookie = getSessionCookie(request);
    const { pathname } = request.nextUrl;

    // If user is not authenticated and trying to access protected routes
    if (!sessionCookie) {
        // Allow access to auth pages and verification pages
        const allowedPaths = [
            '/sign-in', 
            '/sign-up', 
            '/forgot-password', 
            '/reset-password',
            '/forgot-password-otp',
            '/verify-otp',
            '/verify-email',
            '/verify-email-pending'
        ];
        
        if (!allowedPaths.includes(pathname)) {
            return NextResponse.redirect(new URL("/sign-in", request.url));
        }
    }

    // If user is authenticated and trying to access auth pages, redirect to dashboard
    if (sessionCookie && (pathname === '/sign-in' || pathname === '/sign-up')) {
        return NextResponse.redirect(new URL("/", request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        '/((?!api|_next/static|_next/image|favicon.ico|sign-in|sign-up|forgot-password|reset-password|assets).*)',
    ],
};
