import { useState, useCallback, useMemo } from "react";
import { useSelector } from "react-redux";
import {
  validateSignupForm,
  validateLoginForm,
  validateUpdatePasswordForm,
} from "../utils/validation";
import { errorHandler, AuthContext } from "../../../shared/utils/errorUtils";
import { createErrorSelector } from "./authErrorSelectors";
import type { ValidationErrors } from "../types";
import type { RootState } from "@/app/store";

interface Options {
  onSubmit: (data: any) => Promise<{ success: boolean; message: string }>;
  validationType: "login" | "signup" | "updatePassword";
}

export const useAuthForm = ({ onSubmit, validationType }: Options) => {
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  // Get context-specific errors from centralized system using memoized selector
  const context = useMemo(() => getContextFromValidationType(validationType), [validationType]);
  
  // Create a memoized selector for this specific context
  const selectContextErrors = useMemo(() => createErrorSelector(context), [context]);
  
  // Use the memoized selector
  const apiErrors = useSelector(selectContextErrors);

  const handleChange = useCallback(
    (field: string, value: string) => {
      setFormData((prev) => ({ ...prev, [field]: value }));
      
      // Clear validation error for this field
      if (errors[field]) {
        setErrors((prev) => ({ ...prev, [field]: "" }));
      }
      
      // Clear submit message
      if (submitMessage) setSubmitMessage(null);
      
      // Clear field-specific API errors
      if (apiErrors.length > 0) {
        const fieldErrors = apiErrors.filter(error => error.field === field);
        fieldErrors.forEach(error => {
          errorHandler.removeError(error.code);
        });
      }
    },
    [errors, submitMessage, apiErrors]
  );

  const validateForm = useCallback(() => {
    let result;
    if (validationType === "signup") {
      result = validateSignupForm({
        name: formData.name || "",
        email: formData.email || "",
        mobile: formData.mobile || "",
        password: formData.password || "",
        confirmPassword: formData.confirmPassword || "",
      });
    } else if (validationType === "updatePassword") {
      result = validateUpdatePasswordForm({
        currentPassword: formData.currentPassword || "",
        newPassword: formData.newPassword || "",
        confirmPassword: formData.confirmPassword || "",
      });
    } else {
      result = validateLoginForm(
        formData.email || "",
        formData.password || ""
      );
    }
    
    setErrors(result.errors);
    return result.isValid;
  }, [formData, validationType]);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      
      // Clear previous errors
      errorHandler.clearAuthErrors(context);
      setSubmitMessage(null);
      
      if (!validateForm()) return;
      
      setIsSubmitting(true);
      
      try {
        const result = await onSubmit(formData);
        setSubmitMessage({
          type: result.success ? "success" : "error",
          text: result.message,
        });
        
        // DON'T clear formData on success - we need email for OTP
        if (result.success && validationType === "signup") {
          // Only clear errors, keep formData for OTP verification
          setErrors({});
        }
      } catch (err: any) {
        setSubmitMessage({
          type: "error",
          text: err.message || "An unexpected error occurred. Please try again.",
        });
      } finally {
        setIsSubmitting(false);
      }
    },
    [formData, onSubmit, validateForm, validationType, context]
  );

  const resetForm = useCallback(() => {
    setFormData({});
    setErrors({});
    setSubmitMessage(null);
    errorHandler.clearAuthErrors(context);
  }, [context]);

  // Get field-specific errors (validation takes precedence over API)
  const getFieldError = useCallback((fieldName: string) => {
    // Validation error takes precedence
    if (errors[fieldName]) {
      return errors[fieldName];
    }
    
    // Check for API field errors
    const fieldError = apiErrors.find(error => error.field === fieldName);
    return fieldError?.userMessage || fieldError?.message || "";
  }, [errors, apiErrors]);

  return {
    formData,
    errors,
    isSubmitting,
    submitMessage,
    apiErrors, // Expose API errors
    handleChange,
    handleSubmit,
    resetForm,
    validateForm,
    getFieldError, // Enhanced field error getter
  };
};

function getContextFromValidationType(type: string): string {
  switch (type) {
    case "login":
      return AuthContext.LOGIN;
    case "signup":
      return AuthContext.SIGNUP;
    case "updatePassword":
      return AuthContext.PASSWORD_UPDATE;
    default:
      return AuthContext.LOGIN;
  }
}

// Enhanced form hooks with preserved functionality
export const useSignupForm = (onSubmit: any) =>
  useAuthForm({ onSubmit, validationType: "signup" });

export const useLoginForm = (onSubmit: any) =>
  useAuthForm({ onSubmit, validationType: "login" });

export const useUpdatePasswordForm = (onSubmit: any) =>
  useAuthForm({ onSubmit, validationType: "updatePassword" });