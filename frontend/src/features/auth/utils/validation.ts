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
  fieldName: string
): string | null => {
  if (!name) return `${fieldName} is required`;
  if (name.length < 2) return `${fieldName} must be at least 2 characters long`;
  if (!/^[a-zA-Z\s]+$/.test(name))
    return `${fieldName} must contain only letters and spaces`;
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

export const validateSignupForm = (formData: {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
}) => {
  const errors: { [key: string]: string } = {};

  const firstNameError = validateName(formData.firstName, "First name");
  if (firstNameError) errors.firstName = firstNameError;

  const lastNameError = validateName(formData.lastName, "Last name");
  if (lastNameError) errors.lastName = lastNameError;

  const emailError = validateEmail(formData.email);
  if (emailError) errors.email = emailError;

  const passwordError = validatePassword(formData.password);
  if (passwordError) errors.password = passwordError;

  const confirmPasswordError = validateConfirmPassword(
    formData.password,
    formData.confirmPassword
  );
  if (confirmPasswordError) errors.confirmPassword = confirmPasswordError;

  return {
    errors,
    isValid: Object.keys(errors).length === 0,
  };
};
