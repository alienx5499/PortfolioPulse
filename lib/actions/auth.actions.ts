'use server';

import {auth} from "@/lib/better-auth/auth";
import {inngest} from "@/lib/inngest/client";
import {headers} from "next/headers";

export const signUpWithEmail = async ({ email, password, fullName, country, investmentGoals, riskTolerance, preferredIndustry }: SignUpFormData) => {
    try {
        const response = await auth.api.signUpEmail({ body: { email, password, name: fullName } })

        if(response) {
            // Send welcome email directly for development
            try {
                const { sendWelcomeEmail } = await import('@/lib/nodemailer');
                const userProfile = `
                    - Country: ${country}
                    - Investment goals: ${investmentGoals}
                    - Risk tolerance: ${riskTolerance}
                    - Preferred industry: ${preferredIndustry}
                `;
                const intro = `Welcome to PortfolioPulse! Based on your profile: ${userProfile} We're excited to help you track markets and make smarter investment decisions.`;
                
                await sendWelcomeEmail({ email, name: fullName, intro });
                console.log('Welcome email sent successfully');
            } catch (emailError) {
                console.log('Welcome email failed:', emailError);
                // Don't fail the signup if email fails
            }

            // Better Auth will automatically send verification email when requireEmailVerification: true

            // Also try Inngest for production
            try {
                await inngest.send({
                    name: 'app/user.created',
                    data: { email, name: fullName, country, investmentGoals, riskTolerance, preferredIndustry }
                });
            } catch (inngestError) {
                console.log('Inngest send failed:', inngestError);
                // Don't fail the signup if Inngest fails
            }
        }

        return { success: true, data: response }
    } catch (e) {
        console.log('Sign up failed', e)
        return { success: false, error: 'Sign up failed' }
    }
}

export const signInWithEmail = async ({ email, password }: SignInFormData) => {
    try {
        const response = await auth.api.signInEmail({ body: { email, password } })

        return { success: true, data: response }
    } catch (e) {
        console.log('Sign in failed', e)
        return { success: false, error: 'Sign in failed' }
    }
}

export const signOut = async () => {
    try {
        await auth.api.signOut({ headers: await headers() });
    } catch (e) {
        console.log('Sign out failed', e)
        return { success: false, error: 'Sign out failed' }
    }
}

export const forgotPassword = async ({ email }: { email: string }) => {
    try {
        const response = await auth.api.forgetPassword({ body: { email } })
        return { success: true, data: response }
    } catch (e) {
        console.log('Forgot password failed', e)
        return { success: false, error: 'Failed to send reset email' }
    }
}

export const resetPassword = async ({ token, password }: { token: string, password: string }) => {
    try {
        const response = await auth.api.resetPassword({ body: { token, newPassword: password } })
        return { success: true, data: response }
    } catch (e) {
        console.log('Reset password failed', e)
        return { success: false, error: 'Failed to reset password' }
    }
}