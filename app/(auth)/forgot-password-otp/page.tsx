'use client';

import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import InputField from '@/components/forms/InputField';
import FooterLink from '@/components/forms/FooterLink';
import { generateOTP } from '@/lib/actions/otp.actions';
import { toast } from 'sonner';
import { useState } from 'react';

const ForgotPasswordOTP = () => {
    const [message, setMessage] = useState('');
    const [otpSent, setOtpSent] = useState(false);
    const [email, setEmail] = useState('');
    
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<{ email: string }>({
        defaultValues: {
            email: '',
        },
        mode: 'onBlur',
    });

    const onSubmit = async (data: { email: string }) => {
        setMessage('');
        try {
            const result = await generateOTP(data);
            if (result.success) {
                setEmail(data.email);
                setOtpSent(true);
                setMessage('OTP sent successfully! Check your email for the 6-digit code.');
                toast.success('OTP sent!', {
                    description: 'Check your email for the verification code.'
                });
            } else {
                setMessage(result.error || 'Failed to send OTP.');
                toast.error('Failed to send OTP', {
                    description: result.error || 'Please try again later.'
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

    if (otpSent) {
        return (
            <div className="text-center">
                <div className="mb-6">
                    <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                    </div>
                    <h1 className="form-title">Check Your Email</h1>
                    <p className="text-muted-foreground">
                        We've sent a 6-digit OTP code to <strong>{email}</strong>
                    </p>
                </div>
                
                <div className="space-y-4">
                    <Button 
                        onClick={() => window.location.href = '/verify-otp'} 
                        className="primary-btn w-full"
                    >
                        Enter OTP Code
                    </Button>
                    
                    <Button 
                        onClick={() => {
                            setOtpSent(false);
                            setMessage('');
                        }} 
                        variant="outline" 
                        className="w-full"
                    >
                        Use Different Email
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <>
            <h1 className="form-title">Reset Password with OTP</h1>
            <p className="text-muted-foreground text-center mb-6">
                Enter your email address and we'll send you a secure OTP code to reset your password.
            </p>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                <InputField
                    name="email"
                    label="Email Address"
                    placeholder="user@portfoliopulse.app"
                    register={register}
                    error={errors.email}
                    validation={{ required: 'Email is required', pattern: /^\w+@\w+\.\w+$/ }}
                />

                {message && (
                    <p className={`text-sm text-center ${message.includes('Failed') || message.includes('error') ? 'text-destructive' : 'text-success'}`}>
                        {message}
                    </p>
                )}

                <Button type="submit" disabled={isSubmitting} className="primary-btn w-full mt-5">
                    {isSubmitting ? 'Sending OTP...' : 'Send OTP Code'}
                </Button>

                <FooterLink text="Remember your password?" linkText="Sign in" href="/sign-in" />
            </form>
        </>
    );
};

export default ForgotPasswordOTP;
