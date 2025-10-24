'use client';

import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import InputField from '@/components/forms/InputField';
import FooterLink from '@/components/forms/FooterLink';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import PasswordStrengthIndicator from '@/components/PasswordStrengthIndicator';
import { validatePassword } from '@/lib/utils/password-validation';

const VerifyOTP = () => {
    const router = useRouter();
    const [message, setMessage] = useState('');
    const [step, setStep] = useState<'verify' | 'reset'>('verify');
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [newPassword, setNewPassword] = useState('');
    
    // Get email from URL params or localStorage
    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const emailParam = urlParams.get('email');
        const storedEmail = localStorage.getItem('otp-email');
        
        if (emailParam) {
            setEmail(emailParam);
            localStorage.setItem('otp-email', emailParam);
        } else if (storedEmail) {
            setEmail(storedEmail);
        } else {
            // No email found, redirect to forgot password
            router.push('/forgot-password-otp');
        }
    }, [router]);
    
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        setValue,
    } = useForm<{ email: string; otp: string; newPassword: string; confirmPassword: string }>({
        defaultValues: {
            email: '',
            otp: '',
            newPassword: '',
            confirmPassword: '',
        },
        mode: 'onBlur',
    });

    // Update form when email is set
    useEffect(() => {
        if (email) {
            setValue('email', email);
        }
    }, [email, setValue]);

    const onVerifyOTP = async (data: { email: string; otp: string }) => {
        setMessage('');
        try {
            console.log('Verifying OTP with data:', data);
            console.log('Email:', data.email, 'OTP:', data.otp);
            
            const response = await fetch('/api/verify-otp', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: data.email,
                    otp: data.otp
                })
            });
            
            const result = await response.json();
            
            if (result.success) {
                setEmail(data.email);
                setOtp(data.otp);
                setStep('reset');
                setMessage('OTP verified successfully! Now set your new password.');
                toast.success('OTP verified!', {
                    description: 'Please set your new password.'
                });
            } else {
                setMessage(result.error || 'Invalid OTP.');
                toast.error('OTP verification failed', {
                    description: result.error || 'Please check your code and try again.'
                });
            }
        } catch (e) {
            console.error(e);
            setMessage('An unexpected error occurred.');
            toast.error('An unexpected error occurred', {
                description: e instanceof Error ? e.message : 'Please try again later.'
            });
        }
    };

    const onResetPassword = async (data: { email: string; otp: string; newPassword: string; confirmPassword: string }) => {
        setMessage('');
        
        // Validate password strength
        const passwordValidation = validatePassword(data.newPassword);
        if (!passwordValidation.isValid) {
            setMessage('Password does not meet requirements: ' + passwordValidation.errors.join(', '));
            toast.error('Password does not meet requirements', {
                description: passwordValidation.errors.join(', ')
            });
            return;
        }
        
        if (data.newPassword !== data.confirmPassword) {
            setMessage('Passwords do not match.');
            toast.error('Passwords mismatch', { description: 'Please ensure both passwords are the same.' });
            return;
        }

        try {
            const response = await fetch('/api/reset-password-otp', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: data.email,
                    otp: data.otp,
                    newPassword: data.newPassword
                })
            });
            
            const result = await response.json();
            
            if (result.success) {
                setMessage('Password reset successfully! Redirecting to sign in...');
                toast.success('Password reset successful!', {
                    description: 'You can now sign in with your new password.'
                });
                setTimeout(() => {
                    router.push('/sign-in');
                }, 3000);
            } else {
                setMessage(result.error || 'Failed to reset password.');
                toast.error('Password reset failed', {
                    description: result.error || 'Please try again.'
                });
            }
        } catch (e) {
            console.error(e);
            setMessage('An unexpected error occurred.');
            toast.error('An unexpected error occurred', {
                description: e instanceof Error ? e.message : 'Please try again later.'
            });
        }
    };

    if (step === 'reset') {
        return (
            <>
                <h1 className="form-title">Set New Password</h1>
                <p className="text-muted-foreground text-center mb-6">
                    Enter your new password below.
                </p>

                <form onSubmit={handleSubmit(onResetPassword)} className="space-y-5">
                    <input type="hidden" {...register('email')} value={email} />
                    <input type="hidden" {...register('otp')} value={otp} />
                    
                    <InputField
                        name="newPassword"
                        label="New Password"
                        placeholder="Enter your new password"
                        type="password"
                        register={register}
                        error={errors.newPassword}
                        validation={{ required: 'New password is required', minLength: 8 }}
                        onChange={(e) => setNewPassword(e.target.value)}
                    />
                    
                    {/* Password Strength Indicator */}
                    {newPassword && (
                        <div className="mt-2">
                            <PasswordStrengthIndicator password={newPassword} />
                        </div>
                    )}

                    <InputField
                        name="confirmPassword"
                        label="Confirm New Password"
                        placeholder="Confirm your new password"
                        type="password"
                        register={register}
                        error={errors.confirmPassword}
                        validation={{ required: 'Please confirm your new password', minLength: 8 }}
                    />

                    {message && (
                        <p className={`text-sm text-center ${message.includes('Failed') || message.includes('error') || message.includes('mismatch') ? 'text-destructive' : 'text-success'}`}>
                            {message}
                        </p>
                    )}

                    <Button type="submit" disabled={isSubmitting} className="primary-btn w-full mt-5">
                        {isSubmitting ? 'Resetting Password...' : 'Reset Password'}
                    </Button>

                    <Button 
                        type="button"
                        onClick={() => setStep('verify')} 
                        variant="outline" 
                        className="w-full"
                    >
                        Back to OTP Verification
                    </Button>
                </form>
            </>
        );
    }

    return (
        <>
            <h1 className="form-title">Enter OTP Code</h1>
            <p className="text-muted-foreground text-center mb-6">
                Enter the 6-digit OTP code sent to your email address.
            </p>

            <form onSubmit={handleSubmit(onVerifyOTP)} className="space-y-5">
                {/* Hidden email field */}
                <input type="hidden" {...register('email')} value={email} />
                
                <div className="text-center mb-4">
                    <p className="text-sm text-muted-foreground">
                        Enter the 6-digit OTP code sent to <strong>{email}</strong>
                    </p>
                </div>

                <InputField
                    name="otp"
                    label="OTP Code"
                    placeholder="Enter 6-digit code"
                    register={register}
                    error={errors.otp}
                    validation={{ 
                        required: 'OTP is required', 
                        pattern: /^\d{6}$/,
                        message: 'Please enter a valid 6-digit OTP'
                    }}
                />

                {message && (
                    <p className={`text-sm text-center ${message.includes('Failed') || message.includes('error') || message.includes('Invalid') ? 'text-destructive' : 'text-success'}`}>
                        {message}
                    </p>
                )}

                <Button type="submit" disabled={isSubmitting} className="primary-btn w-full mt-5">
                    {isSubmitting ? 'Verifying OTP...' : 'Verify OTP'}
                </Button>

                <div className="text-center">
                    <Button 
                        type="button"
                        onClick={() => router.push('/forgot-password-otp')} 
                        variant="ghost" 
                        className="text-sm text-primary hover:text-primary/80"
                    >
                        Didn't receive OTP? Send again
                    </Button>
                </div>

                <FooterLink text="Remember your password?" linkText="Sign in" href="/sign-in" />
            </form>
        </>
    );
};

export default VerifyOTP;

