'use client';

import { useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { toast } from 'sonner';

const VerifyEmailPending = () => {
    const searchParams = useSearchParams();
    const email = searchParams.get('email');
    const [isResending, setIsResending] = useState(false);

    const handleResendVerification = async () => {
        if (!email) return;
        
        setIsResending(true);
        try {
            const response = await fetch('/api/auth/resend-verification', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email })
            });

            const result = await response.json();

            if (result.success) {
                toast.success('Verification email sent!', {
                    description: 'Please check your email for the verification link.'
                });
            } else {
                toast.error('Failed to resend email', {
                    description: result.error || 'Please try again later.'
                });
            }
        } catch (error) {
            toast.error('Failed to resend email', {
                description: 'Please try again later.'
            });
        } finally {
            setIsResending(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-background">
            <div className="max-w-md w-full mx-auto p-6">
                <div className="text-center">
                    <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                    </div>
                    <h1 className="text-2xl font-bold text-foreground mb-2">Check Your Email</h1>
                    <p className="text-muted-foreground mb-6">
                        We've sent a verification link to <strong>{email}</strong>. 
                        Please check your email and click the link to verify your account.
                    </p>
                    
                    <div className="space-y-4">
                        <Button 
                            onClick={handleResendVerification}
                            disabled={isResending}
                            variant="outline"
                            className="w-full"
                        >
                            {isResending ? 'Sending...' : 'Resend Verification Email'}
                        </Button>
                        
                        <p className="text-sm text-muted-foreground">
                            Didn't receive the email? Check your spam folder or try resending.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default VerifyEmailPending;
