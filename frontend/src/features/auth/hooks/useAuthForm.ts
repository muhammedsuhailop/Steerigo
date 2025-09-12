import { useState, useCallback } from 'react';
import { validateLoginForm, validateSignupForm } from '../utils/validation';
import type { LoginRequest, SignupRequest, ValidationErrors } from '../types';

interface UseAuthFormOptions {
  onSubmit: (data: any) => Promise<{ success: boolean; message: string }>;
  validationType: 'login' | 'signup';
}

export const useAuthForm = ({ onSubmit, validationType }: UseAuthFormOptions) => {
  const [formData, setFormData] = useState<any>({});
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleChange = useCallback((field: string, value: string) => {
    setFormData((prev: any) => ({ ...prev, [field]: value }));
    
    // Clear field error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
    
    // Clear submit message when user makes changes
    if (submitMessage) {
      setSubmitMessage(null);
    }
  }, [errors, submitMessage]);

  const validateForm = useCallback(() => {
    let validationResult;
    
    if (validationType === 'login') {
      validationResult = validateLoginForm(formData.email || '', formData.password || '');
    } else if (validationType === 'signup') {
      validationResult = validateSignupForm({
        firstName: formData.firstName || '',
        lastName: formData.lastName || '',
        email: formData.email || '',
        password: formData.password || '',
        confirmPassword: formData.confirmPassword || ''
      });
    } else {
      validationResult = { errors: {}, isValid: true };
    }
    
    setErrors(validationResult.errors);
    return validationResult.isValid;
  }, [formData, validationType]);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    setSubmitMessage(null);
    
    try {
      const result = await onSubmit(formData);
      
      if (result.success) {
        setSubmitMessage({ type: 'success', text: result.message });
        // Clear form on success if it's not login (for signup, etc.)
        if (validationType !== 'login') {
          setFormData({});
        }
      } else {
        setSubmitMessage({ type: 'error', text: result.message });
      }
    } catch (error: any) {
      setSubmitMessage({ 
        type: 'error', 
        text: error.message || 'An unexpected error occurred. Please try again.' 
      });
    } finally {
      setIsSubmitting(false);
    }
  }, [formData, onSubmit, validateForm, validationType]);

  const clearMessage = useCallback(() => {
    setSubmitMessage(null);
  }, []);

  const resetForm = useCallback(() => {
    setFormData({});
    setErrors({});
    setSubmitMessage(null);
  }, []);

  const setFieldError = useCallback((field: string, error: string) => {
    setErrors(prev => ({ ...prev, [field]: error }));
  }, []);

  return {
    formData,
    errors,
    isSubmitting,
    submitMessage,
    handleChange,
    handleSubmit,
    clearMessage,
    resetForm,
    setFieldError,
    validateForm,
  };
};

// Specialized hooks for different form types
export const useLoginForm = (onSubmit: (data: LoginRequest) => Promise<{ success: boolean; message: string }>) => {
  return useAuthForm({ onSubmit, validationType: 'login' });
};

export const useSignupForm = (onSubmit: (data: SignupRequest) => Promise<{ success: boolean; message: string }>) => {
  return useAuthForm({ onSubmit, validationType: 'signup' });
};