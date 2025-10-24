'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

const VerifyEmail = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
    const [message, setMessage] = useState('');

    useEffect(() => {
        const verifyEmail = async () => {
            try {
                const token = searchParams.get('token');
                const email = searchParams.get('email');

                if (!token || !email) {
                    setStatus('error');
                    setMessage('Invalid verification link');
                    return;
                }

                // Call Better Auth verification endpoint
                const response = await fetch('/api/auth/verify-email', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        token,
                        email
                    })
                });

                const result = await response.json();

                if (result.success) {
                    setStatus('success');
                    setMessage('Email verified successfully!');
                    toast.success('Email verified!', {
                        description: 'Your account is now active. You can sign in.'
                    });
                } else {
                    setStatus('error');
                    setMessage(result.error || 'Verification failed');
                    toast.error('Verification failed', {
                        description: result.error || 'Please try again.'
                    });
                }
            } catch (error) {
                setStatus('error');
                setMessage('An error occurred during verification');
                toast.error('Verification error', {
                    description: 'Please try again later.'
                });
            }
        };

        verifyEmail();
    }, [searchParams]);

    if (status === 'loading') {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background">
                <div className="max-w-md w-full mx-auto p-6">
                    <div className="text-center">
                        <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
                            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                        </div>
                        <h1 className="text-2xl font-bold text-foreground mb-2">Verifying Email...</h1>
                        <p className="text-muted-foreground">Please wait while we verify your email address.</p>
                    </div>
                </div>
            </div>
        );
    }

    if (status === 'success') {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background">
                <div className="max-w-md w-full mx-auto p-6">
                    <div className="text-center">
                        <div className="w-16 h-16 bg-success/20 rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg className="w-8 h-8 text-success" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                        <h1 className="text-2xl font-bold text-foreground mb-2">Email Verified!</h1>
                        <p className="text-muted-foreground mb-6">
                            Your email has been successfully verified. You can now sign in to your account.
                        </p>
                        <Button 
                            onClick={() => router.push('/sign-in')}
                            className="w-full"
                        >
                            Sign In to Your Account
                        </Button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-background">
            <div className="max-w-md w-full mx-auto p-6">
                <div className="text-center">
                    <div className="w-16 h-16 bg-destructive/20 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-8 h-8 text-destructive" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </div>
                    <h1 className="text-2xl font-bold text-foreground mb-2">Verification Failed</h1>
                    <p className="text-muted-foreground mb-6">
                        {message || 'We couldn\'t verify your email address. The link may be expired or invalid.'}
                    </p>
                    <div className="space-y-3">
                        <Button 
                            onClick={() => router.push('/sign-up')}
                            className="w-full"
                        >
                            Create New Account
                        </Button>
                        <Button 
                            onClick={() => router.push('/sign-in')}
                            variant="outline"
                            className="w-full"
                        >
                            Sign In
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default VerifyEmail;
