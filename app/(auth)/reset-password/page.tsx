'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ArrowLeft, Lock, Loader2, CheckCircle } from 'lucide-react';
import { resetPassword } from '@/lib/actions/auth.actions';

export default function ResetPasswordPage() {
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [token, setToken] = useState('');
    const [isSuccess, setIsSuccess] = useState(false);
    
    const router = useRouter();
    const searchParams = useSearchParams();

    useEffect(() => {
        const tokenParam = searchParams.get('token');
        if (!tokenParam) {
            setError('Invalid or missing reset token');
            return;
        }
        setToken(tokenParam);
    }, [searchParams]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');
        setMessage('');

        // Validation
        if (password !== confirmPassword) {
            setError('Passwords do not match');
            setIsLoading(false);
            return;
        }

        if (password.length < 8) {
            setError('Password must be at least 8 characters long');
            setIsLoading(false);
            return;
        }

        try {
            const result = await resetPassword({ token, password });
            
            if (result.success) {
                setIsSuccess(true);
                setMessage('Password reset successfully! You can now sign in with your new password.');
                
                // Redirect to sign in after 3 seconds
                setTimeout(() => {
                    router.push('/sign-in');
                }, 3000);
            } else {
                setError(result.error || 'Failed to reset password');
            }
        } catch (err) {
            setError('An unexpected error occurred. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    if (isSuccess) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center p-4">
                <div className="w-full max-w-md">
                    <Card>
                        <CardContent className="pt-6">
                            <div className="text-center">
                                <div className="mx-auto w-16 h-16 bg-success/20 rounded-full flex items-center justify-center mb-4">
                                    <CheckCircle className="h-8 w-8 text-success" />
                                </div>
                                <h2 className="text-2xl font-bold text-foreground mb-2">Password Reset Successful!</h2>
                                <p className="text-muted-foreground mb-6">
                                    Your password has been updated successfully. You can now sign in with your new password.
                                </p>
                                <Button 
                                    onClick={() => router.push('/sign-in')}
                                    className="w-full"
                                >
                                    Continue to Sign In
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                {/* Back Button */}
                <div className="mb-6">
                    <Link 
                        href="/sign-in" 
                        className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        Back to Sign In
                    </Link>
                </div>

                {/* Header */}
                <div className="text-center mb-8">
                    <div className="flex items-center justify-center mb-4">
                        <img 
                            src="/assets/icons/portfoliopulse-icon.svg" 
                            alt="PortfolioPulse" 
                            width={48} 
                            height={48}
                            className="mr-3"
                        />
                        <span className="text-2xl font-bold text-foreground">PortfolioPulse</span>
                    </div>
                    <h1 className="text-2xl font-bold text-foreground mb-2">Set New Password</h1>
                    <p className="text-muted-foreground">
                        Enter your new password below to complete the reset process.
                    </p>
                </div>

                {/* Form */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Lock className="h-5 w-5 text-primary" />
                            Reset Password
                        </CardTitle>
                        <CardDescription>
                            Choose a strong password for your account
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="password">New Password</Label>
                                <Input
                                    id="password"
                                    type="password"
                                    placeholder="Enter your new password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    disabled={isLoading}
                                    className="w-full"
                                />
                                <p className="text-xs text-muted-foreground">
                                    Must be at least 8 characters long
                                </p>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="confirmPassword">Confirm Password</Label>
                                <Input
                                    id="confirmPassword"
                                    type="password"
                                    placeholder="Confirm your new password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    required
                                    disabled={isLoading}
                                    className="w-full"
                                />
                            </div>

                            {error && (
                                <Alert variant="destructive">
                                    <AlertDescription>{error}</AlertDescription>
                                </Alert>
                            )}

                            {message && (
                                <Alert className="border-success bg-success/10">
                                    <AlertDescription className="text-success">
                                        {message}
                                    </AlertDescription>
                                </Alert>
                            )}

                            <Button 
                                type="submit" 
                                className="w-full" 
                                disabled={isLoading || !password || !confirmPassword}
                            >
                                {isLoading ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Resetting Password...
                                    </>
                                ) : (
                                    'Reset Password'
                                )}
                            </Button>
                        </form>

                        <div className="mt-6 text-center">
                            <p className="text-sm text-muted-foreground">
                                Remember your password?{' '}
                                <Link 
                                    href="/sign-in" 
                                    className="text-primary hover:text-primary/80 font-medium"
                                >
                                    Sign in instead
                                </Link>
                            </p>
                        </div>
                    </CardContent>
                </Card>

                {/* Footer */}
                <div className="mt-8 text-center">
                    <p className="text-xs text-muted-foreground">
                        Need help? Contact{' '}
                        <a 
                            href="mailto:support@portfoliopulse.com" 
                            className="text-primary hover:text-primary/80"
                        >
                            support@portfoliopulse.com
                        </a>
                    </p>
                </div>
            </div>
        </div>
    );
}
