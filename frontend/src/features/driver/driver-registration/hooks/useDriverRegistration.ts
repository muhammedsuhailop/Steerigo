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
  UploadResponse,
} from "../types/driverRegistration.types";
import { driverValidationService } from "../services/driverValidation.service";
import {
  useRegisterDriverMutation,
  useUploadDocumentMutation,
} from "../services/driverRegistrationApi";

export const useDriverRegistration = () => {
  const dispatch = useAppDispatch();

  // RTK Query mutations
  const [registerDriver] = useRegisterDriverMutation();
  const [uploadDocumentApi] = useUploadDocumentMutation();

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

  // const handleDocumentUpload = useCallback(
  //   async (file: File, fieldName: string): Promise<UploadResponse> => {
  //     try {
  //       const response = await uploadDocumentApi({ file, fieldName }).unwrap();
  //       updateData({ [fieldName]: response.url! });
  //       return { success: true, url: response.url, message: response.message };
  //     } catch (error: any) {
  //       return { success: false, message: error.data?.message || "Upload failed" };
  //     }
  //   },
  //   [uploadDocumentApi, updateData]
  // );

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
      const result = await registerDriver(
        formData as DriverRegistrationData
      ).unwrap();
      dispatch(resetForm());
      return { success: true, data: result.data };
    } catch (error: any) {
      return {
        success: false,
        error: error.data?.message || "Registration failed",
      };
    }
  }, [dispatch, formData, validateForm, registerDriver]);

  const resetRegistrationForm = useCallback(() => {
    dispatch(resetForm());
  }, [dispatch]);

  const getStepCompletionStatus = useCallback(() => {
    return {
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
    } as Record<RegistrationStep, boolean>;
  }, [formData]);

  const canProceedToNext = useCallback(
    () => validateCurrentStep().isValid,
    [validateCurrentStep]
  );

  const getFormCompletionPercentage = useCallback(() => {
    const status = getStepCompletionStatus();
    const completed = Object.values(status).filter(Boolean).length;
    return Math.round(
      (completed / Object.values(RegistrationStep).length) * 100
    );
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
