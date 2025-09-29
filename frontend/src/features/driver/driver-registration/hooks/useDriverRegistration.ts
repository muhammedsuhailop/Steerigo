import { useCallback } from "react";
import { useAppDispatch, useAppSelector } from "@/app/store/hooks";
import {
  updateFormData,
  setCurrentStep,
  nextStep,
  previousStep,
  setErrors,
  clearError,
  clearAllErrors,
  resetForm,
  uploadDocument,
  submitRegistration,
  selectFormData,
  selectCurrentStep,
  selectErrors,
  selectIsLoading,
  selectUploadProgress,
  selectIsSubmitting,
  selectRegistrationSuccess,
  selectRegistrationError,
} from "../store/driverRegistrationSlice";
import {
  DriverRegistrationData,
  RegistrationStep,
  ValidationResult,
} from "../types/driverRegistration.types";
import { driverValidationService } from "../services/driverValidation.service";

export const useDriverRegistration = () => {
  const dispatch = useAppDispatch();

  // Selectors
  const formData = useAppSelector(selectFormData);
  const currentStep = useAppSelector(selectCurrentStep);
  const errors = useAppSelector(selectErrors);
  const isLoading = useAppSelector(selectIsLoading);
  const uploadProgress = useAppSelector(selectUploadProgress);
  const isSubmitting = useAppSelector(selectIsSubmitting);
  const registrationSuccess = useAppSelector(selectRegistrationSuccess);
  const registrationError = useAppSelector(selectRegistrationError);

  const updateData = useCallback(
    (data: Partial<DriverRegistrationData>, validateStep: boolean = false) => {
      dispatch(updateFormData(data));

      Object.keys(data).forEach((key) => {
        if (errors[key]) {
          dispatch(clearError(key));
        }
      });

      if (validateStep) {
        const updatedData = { ...formData, ...data };
        const validation = driverValidationService.validateStep(
          currentStep,
          updatedData
        );
        if (!validation.isValid) {
          dispatch(setErrors(validation.errors));
        }
      }
    },
    [dispatch, formData, errors, currentStep]
  );

  const goToNextStep = useCallback(() => {
    const validation = driverValidationService.validateStep(
      currentStep,
      formData
    );

    if (validation.isValid) {
      dispatch(clearAllErrors());
      dispatch(nextStep());
      return true;
    } else {
      dispatch(setErrors(validation.errors));

      scrollToFirstError(validation.errors);

      return false;
    }
  }, [dispatch, currentStep, formData]);

  const scrollToFirstError = (errors: Record<string, string>) => {
    const firstErrorField = Object.keys(errors)[0];
    if (firstErrorField) {
      const element = document.querySelector(`[name="${firstErrorField}"]`);
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "center" });
        if (
          element instanceof HTMLInputElement ||
          element instanceof HTMLSelectElement
        ) {
          element.focus();
        }
      }
    }
  };

  const goToPreviousStep = useCallback(() => {
    dispatch(previousStep());
  }, [dispatch]);

  const goToStep = useCallback(
    (step: RegistrationStep) => {
      dispatch(setCurrentStep(step));
    },
    [dispatch]
  );

  const handleDocumentUpload = useCallback(
    async (file: File, fieldName: string) => {
      try {
        // Simulate upload delay
        await new Promise((resolve) => setTimeout(resolve, 1000));

        const mockUrl = `https://mockcdn.example.com/${fieldName}-${Date.now()}.jpg`;

        // Update form data directly with mock URL
        updateData({ [fieldName]: mockUrl });

        return { success: true, url: mockUrl };
      } catch (error) {
        return {
          success: false,
          error: error instanceof Error ? error.message : "Upload failed",
        };
      }
    },
    [updateData]
  );

  const validateCurrentStep = useCallback((): ValidationResult => {
    return driverValidationService.validateStep(currentStep, formData);
  }, [currentStep, formData]);

  const validateForm = useCallback((): ValidationResult => {
    return driverValidationService.validateAll(
      formData as DriverRegistrationData
    );
  }, [formData]);

  const handleSubmitRegistration = useCallback(async () => {
    const validation = validateForm();

    if (!validation.isValid) {
      dispatch(setErrors(validation.errors));
      return { success: false, errors: validation.errors };
    }

    try {
      const formDataToSubmit = new FormData();

      // Add text fields
      Object.entries(formData).forEach(([key, value]) => {
        if (value && typeof value === "string") {
          formDataToSubmit.append(key, value);
        } else if (Array.isArray(value)) {
          formDataToSubmit.append(key, JSON.stringify(value));
        }
      });

      // Add files if they exist
      if (formData.licenseFrontImage instanceof File) {
        formDataToSubmit.append(
          "licenseFrontImage",
          formData.licenseFrontImage
        );
      }
      if (formData.licenseBackImage instanceof File) {
        formDataToSubmit.append("licenseBackImage", formData.licenseBackImage);
      }
      if (formData.idFrontImage instanceof File) {
        formDataToSubmit.append("idFrontImage", formData.idFrontImage);
      }
      if (formData.idBackImage instanceof File) {
        formDataToSubmit.append("idBackImage", formData.idBackImage);
      }

      const result = await dispatch(submitRegistration(formDataToSubmit));

      if (submitRegistration.fulfilled.match(result)) {
        return { success: true, data: result.payload };
      } else {
        return { success: false, error: result.payload };
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Registration failed",
      };
    }
  }, [dispatch, formData, validateForm]);

  const resetRegistrationForm = useCallback(() => {
    dispatch(resetForm());
  }, [dispatch]);

  const getStepCompletionStatus = useCallback(() => {
    const stepStatus: Record<RegistrationStep, boolean> = {
      [RegistrationStep.PERSONAL_INFO]:
        driverValidationService.validatePersonalInfo(formData).isValid,
      [RegistrationStep.LICENSE_INFO]:
        driverValidationService.validateLicenseInfo(formData).isValid,
      [RegistrationStep.ID_INFO]:
        driverValidationService.validateIdInfo(formData).isValid,
      [RegistrationStep.DOCUMENTS]:
        driverValidationService.validateDocuments(formData).isValid,
      [RegistrationStep.REVIEW]: driverValidationService.validateAll(
        formData as DriverRegistrationData
      ).isValid,
    };

    return stepStatus;
  }, [formData]);

  const canProceedToNext = useCallback(() => {
    const validation = validateCurrentStep();
    return validation.isValid;
  }, [validateCurrentStep]);

  const getFormCompletionPercentage = useCallback(() => {
    const stepStatus = getStepCompletionStatus();
    const completedSteps = Object.values(stepStatus).filter(Boolean).length;
    return Math.round((completedSteps / Object.keys(stepStatus).length) * 100);
  }, [getStepCompletionStatus]);

  return {
    // State
    formData,
    currentStep,
    errors,
    isLoading,
    uploadProgress,
    isSubmitting,
    registrationSuccess,
    registrationError,

    // Actions
    updateData,
    goToNextStep,
    goToPreviousStep,
    goToStep,
    handleDocumentUpload,
    handleSubmitRegistration,
    resetRegistrationForm,

    // Validation
    validateCurrentStep,
    validateForm,
    canProceedToNext,

    // Utilities
    getStepCompletionStatus,
    getFormCompletionPercentage,
  };
};
