export const validateEmail = (email: string): string | null => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) return "Email is required";
    if (!emailRegex.test(email)) return "Please enter a valid email address";
    return null;
};

export const validatePassword = (password: string): string | null => {
    if (!password) return "Password is required";
    if (password.length < 8) return "Password must be at least 8 characters long";
    if (!/(?=.*[a-z])/.test(password))
        return "Password must contain at least one lowercase letter";
    if (!/(?=.*[A-Z])/.test(password))
        return "Password must contain at least one uppercase letter";
    if (!/(?=.*\d)/.test(password))
        return "Password must contain at least one number";
    if (!/(?=.*[@$!%*?&])/.test(password))
        return "Password must contain at least one special character";
    return null;
};

export const validateConfirmPassword = (
    password: string,
    confirmPassword: string
): string | null => {
    if (!confirmPassword) return "Please confirm your password";
    if (password !== confirmPassword) return "Passwords do not match";
    return null;
};

export const validateName = (
    name: string,
): string | null => {
    if (!name) return `Name is required`;
    if (name.length < 2) return `Name must be at least 2 characters long`;
    if (!/^[a-zA-Z\s]+$/.test(name))
        return `$Name must contain only letters and spaces`;
    return null;
};

export const validateOTP = (otp: string): string | null => {
    if (!otp) return "OTP is required";
    if (!/^\d{4}$/.test(otp)) return "OTP must be exactly 4 digits";
    return null;
};

export const validateLoginForm = (email: string, password: string) => {
    const errors: { [key: string]: string } = {};

    const emailError = validateEmail(email);
    if (emailError) errors.email = emailError;

    if (!password) errors.password = "Password is required";

    return {
        errors,
        isValid: Object.keys(errors).length === 0,
    };
};


export const validateMobile = (mobile: string): string | null => {
    if (!mobile) return "Mobile number is required";
    const clean = mobile.replace(/\D/g, "");
    if (clean.length < 10) return "Mobile number must be at least 10 digits";
    if (clean.length > 15) return "Mobile number must be less than 15 digits";
    const regex = /^[+]?[1-9][0-9]{9,14}$/;
    if (!regex.test(mobile)) return "Please enter a valid mobile number";
    return null;
};

export const validateSignupForm = (data: {
    name: string;
    email: string;
    mobile: string;
    password: string;
    confirmPassword: string;
}) => {
    const errors: Record<string, string> = {};
    const e1 = validateName(data.name);
    if (e1) errors.name = e1;
    const e2 = validateEmail(data.email);
    if (e2) errors.email = e2;
    const e3 = validateMobile(data.mobile);
    if (e3) errors.mobile = e3;
    const e4 = validatePassword(data.password);
    if (e4) errors.password = e4;
    const e5 = validateConfirmPassword(data.password, data.confirmPassword);
    if (e5) errors.confirmPassword = e5;
    return { errors, isValid: Object.keys(errors).length === 0 };
};

export const validateUpdatePasswordForm = (data: {
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
}) => {
    const errors: Record<string, string> = {};

    if (!data.currentPassword) {
        errors.currentPassword = "Current password is required";
    }

    const newPasswordError = validatePassword(data.newPassword);
    if (newPasswordError) errors.newPassword = newPasswordError;

    const confirmPasswordError = validateConfirmPassword(data.newPassword, data.confirmPassword);
    if (confirmPasswordError) errors.confirmPassword = confirmPasswordError;

    if (data.currentPassword && data.newPassword && data.currentPassword === data.newPassword) {
        errors.newPassword = "New password must be different from current password";
    }

    return { errors, isValid: Object.keys(errors).length === 0 };
};