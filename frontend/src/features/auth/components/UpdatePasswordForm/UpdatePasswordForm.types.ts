export interface UpdatePasswordFormProps {
    className?: string;
    isLoading?: boolean;
}

export interface UpdatePasswordData {
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
}
