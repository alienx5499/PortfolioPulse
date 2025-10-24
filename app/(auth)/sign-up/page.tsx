'use client';

import {useForm} from "react-hook-form";
import {Button} from "@/components/ui/button";
import InputField from "@/components/forms/InputField";
import SelectField from "@/components/forms/SelectField";
import {INVESTMENT_GOALS, PREFERRED_INDUSTRIES, RISK_TOLERANCE_OPTIONS} from "@/lib/constants";
import {CountrySelectField} from "@/components/forms/CountrySelectField";
import FooterLink from "@/components/forms/FooterLink";
import {signUpWithEmail} from "@/lib/actions/auth.actions";
import {useRouter} from "next/navigation";
import {toast} from "sonner";
import {useState, useEffect} from "react";
import PasswordStrengthIndicator from "@/components/PasswordStrengthIndicator";
import {validatePassword} from "@/lib/utils/password-validation";

const SignUp = () => {
    const router = useRouter()
    const [password, setPassword] = useState('');
    
    const {
        register,
        handleSubmit,
        control,
        formState: { errors, isSubmitting },
        watch,
    } = useForm<SignUpFormData>({
        defaultValues: {
            fullName: '',
            email: '',
            password: '',
            country: 'US',
            investmentGoals: 'Growth',
            riskTolerance: 'Medium',
            preferredIndustry: 'Technology'
        },
        mode: 'onBlur'
    }, );

    // Watch password field for strength indicator
    const watchedPassword = watch('password');
    
    // Update password state when form password changes
    useEffect(() => {
        setPassword(watchedPassword || '');
    }, [watchedPassword]);

    const onSubmit = async (data: SignUpFormData) => {
        // Validate password strength
        const passwordValidation = validatePassword(data.password);
        if (!passwordValidation.isValid) {
            toast.error('Password does not meet requirements', {
                description: passwordValidation.errors.join(', ')
            });
            return;
        }

        try {
            const result = await signUpWithEmail(data);
            if(result.success) {
                toast.success('Account created successfully!');
                // Use Next.js router for navigation
                router.push('/');
            } else {
                toast.error('Sign up failed', {
                    description: result.error || 'Failed to create account'
                });
            }
        } catch (e) {
            console.error(e);
            toast.error('Sign up failed', {
                description: e instanceof Error ? e.message : 'Failed to create an account.'
            })
        }
    }

    return (
        <>
            <h1 className="form-title">Sign Up & Personalize</h1>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                <InputField
                    name="fullName"
                    label="Full Name"
                    placeholder="John Doe"
                    register={register}
                    error={errors.fullName}
                    validation={{ required: 'Full name is required', minLength: 2 }}
                />

                <InputField
                    name="email"
                    label="Email"
                    placeholder="user@portfoliopulse.app"
                    register={register}
                    error={errors.email}
                    validation={{ required: 'Email name is required', pattern: /^\w+@\w+\.\w+$/, message: 'Email address is required' }}
                />

                <InputField
                    name="password"
                    label="Password"
                    placeholder="Enter a strong password"
                    type="password"
                    register={register}
                    error={errors.password}
                    validation={{ required: 'Password is required', minLength: 8 }}
                />
                
                {/* Password Strength Indicator */}
                {password && (
                    <div className="mt-2">
                        <PasswordStrengthIndicator password={password} />
                    </div>
                )}

                <CountrySelectField
                    name="country"
                    label="Country"
                    control={control}
                    error={errors.country}
                    required
                />

                <SelectField
                    name="investmentGoals"
                    label="Investment Goals"
                    placeholder="Select your investment goal"
                    options={INVESTMENT_GOALS}
                    control={control}
                    error={errors.investmentGoals}
                    required
                />

                <SelectField
                    name="riskTolerance"
                    label="Risk Tolerance"
                    placeholder="Select your risk level"
                    options={RISK_TOLERANCE_OPTIONS}
                    control={control}
                    error={errors.riskTolerance}
                    required
                />

                <SelectField
                    name="preferredIndustry"
                    label="Preferred Industry"
                    placeholder="Select your preferred industry"
                    options={PREFERRED_INDUSTRIES}
                    control={control}
                    error={errors.preferredIndustry}
                    required
                />

                <Button type="submit" disabled={isSubmitting} className="primary-btn w-full mt-5">
                    {isSubmitting ? 'Creating Account...' : 'Start Your Investing Journey'}
                </Button>

                <FooterLink text="Already have an account?" linkText="Sign in" href="/sign-in" />
            </form>
        </>
    )
}
export default SignUp;
