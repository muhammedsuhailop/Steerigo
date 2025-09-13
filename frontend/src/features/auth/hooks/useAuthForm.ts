import { useState, useCallback } from "react";
import {
    validateSignupForm,
    validateLoginForm,
} from "../utils/validation";
import type { ValidationErrors } from "../types";

interface Options {
    onSubmit: (data: any) => Promise<{ success: boolean; message: string }>;
    validationType: "login" | "signup";
}

export const useAuthForm = ({ onSubmit, validationType }: Options) => {
    const [formData, setFormData] = useState<any>({});
    const [errors, setErrors] = useState<ValidationErrors>({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitMessage, setSubmitMessage] = useState<{
        type: "success" | "error";
        text: string;
    } | null>(null);

    const handleChange = useCallback(
        (field: string, value: string) => {
            setFormData((p: any) => ({ ...p, [field]: value }));
            if (errors[field]) setErrors((p) => ({ ...p, [field]: "" }));
            if (submitMessage) setSubmitMessage(null);
        },
        [errors, submitMessage]
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
            if (!validateForm()) return;
            setIsSubmitting(true);
            setSubmitMessage(null);
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
                    text: err.message || "Unexpected error",
                });
            } finally {
                setIsSubmitting(false);
            }
        },
        [formData, onSubmit, validateForm, validationType]
    );

    const resetForm = useCallback(() => {
        setFormData({});
        setErrors({});
        setSubmitMessage(null);
    }, []);

    return {
        formData,
        errors,
        isSubmitting,
        submitMessage,
        handleChange,
        handleSubmit,
        resetForm,
        validateForm,
    };
};

export const useSignupForm = (onSubmit: any) =>
    useAuthForm({ onSubmit, validationType: "signup" });
export const useLoginForm = (onSubmit: any) =>
    useAuthForm({ onSubmit, validationType: "login" });
