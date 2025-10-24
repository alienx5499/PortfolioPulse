import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/database/mongoose';
import { getAuth } from '@/lib/better-auth/auth';

export async function POST(request: NextRequest) {
    try {
        const { token, email } = await request.json();

        if (!token || !email) {
            return NextResponse.json({
                success: false,
                error: 'Token and email are required'
            }, { status: 400 });
        }

        // Connect to database
        const mongoose = await connectToDatabase();
        if (!mongoose) {
            return NextResponse.json({
                success: false,
                error: 'Database connection failed'
            }, { status: 500 });
        }

        // Find user by email
        const db = mongoose.connection.db;
        const usersCollection = db.collection('user');
        const user = await usersCollection.findOne({ email });

        if (!user) {
            return NextResponse.json({
                success: false,
                error: 'User not found'
            }, { status: 404 });
        }

        // For now, we'll just mark the user as verified
        // In a real implementation, you'd verify the token
        const result = await usersCollection.updateOne(
            { email },
            {
                $set: {
                    emailVerified: true,
                    emailVerifiedAt: new Date(),
                    updatedAt: new Date()
                }
            }
        );

        if (result.modifiedCount === 0) {
            return NextResponse.json({
                success: false,
                error: 'Failed to verify email'
            }, { status: 500 });
        }

        return NextResponse.json({
            success: true,
            message: 'Email verified successfully'
        });

    } catch (error) {
        console.error('Email verification error:', error);
        return NextResponse.json({
            success: false,
            error: 'Internal server error'
        }, { status: 500 });
    }
}
