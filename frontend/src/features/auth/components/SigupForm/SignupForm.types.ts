export interface SignupFormProps {
    onSubmit?: (data: {
        name: string;
        email: string;
        mobile: string;
        password: string;
        confirmPassword: string;
    }) => Promise<{ success: boolean; message: string }>;
    isLoading?: boolean;
    className?: string;
    showGoogleAuth?: boolean;
    redirectTo?: string;
}

export interface SignupFormData {
    name: string;
    email: string;
    mobile: string;
    password: string;
    confirmPassword: string;
}

export interface OTPVerificationData {
    email: string;
    otp: string;
}
