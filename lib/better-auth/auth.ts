import { betterAuth } from "better-auth";
import { mongodbAdapter} from "better-auth/adapters/mongodb";
import { connectToDatabase} from "@/database/mongoose";
import { nextCookies} from "better-auth/next-js";

let authInstance: ReturnType<typeof betterAuth> | null = null;

export const getAuth = async () => {
    if(authInstance) return authInstance;

    const mongoose = await connectToDatabase();
    if (!mongoose) {
        throw new Error('Database connection required - MongoDB not available');
    }
    const db = mongoose.connection.db;

    if(!db) throw new Error('MongoDB connection not found');

    authInstance = betterAuth({
        database: mongodbAdapter(db as any),
        secret: process.env.BETTER_AUTH_SECRET,
        baseURL: process.env.BETTER_AUTH_URL,
        emailAndPassword: {
            enabled: true,
            disableSignUp: false,
            requireEmailVerification: true, // Enforce email verification
            minPasswordLength: 8,
            maxPasswordLength: 128,
            autoSignIn: false,
            sendResetPassword: async ({ user, url }) => {
                // Send password reset email
                const { sendPasswordResetEmail } = await import('@/lib/nodemailer');
                await sendPasswordResetEmail({ email: user.email, name: user.name, resetUrl: url });
            },
            sendVerificationEmail: async ({ user, url }) => {
                // Send email verification email
                const { sendVerificationEmail } = await import('@/lib/nodemailer');
                await sendVerificationEmail({ email: user.email, name: user.name, verificationUrl: url });
            },
        },
        plugins: [nextCookies()],
        // Add custom pages configuration
        pages: {
            resetPassword: "/reset-password",
            verifyEmail: "/verify-email"
        }
    });

    return authInstance;
}

// Initialize auth with error handling
let auth: ReturnType<typeof betterAuth>;

try {
    auth = await getAuth();
} catch (error) {
    console.error('Failed to initialize Better Auth:', error);
    // Create a minimal auth instance for fallback
    auth = betterAuth({
        database: null as any,
        secret: process.env.BETTER_AUTH_SECRET || 'fallback-secret',
        baseURL: process.env.BETTER_AUTH_URL || 'http://localhost:3000',
        emailAndPassword: {
            enabled: true,
            disableSignUp: false,
            requireEmailVerification: true, // Enforce email verification
            minPasswordLength: 8,
            maxPasswordLength: 128,
            autoSignIn: false,
        },
        plugins: [nextCookies()],
    });
}

export { auth };
