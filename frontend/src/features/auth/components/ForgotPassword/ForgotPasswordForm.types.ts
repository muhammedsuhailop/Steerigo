export interface ForgotPasswordFormProps {
    className?: string;
    isLoading?: boolean;
}

export interface OTPResetData {
    email: string;
    otp: string;
    newPassword: string;
    confirmPassword: string;
}