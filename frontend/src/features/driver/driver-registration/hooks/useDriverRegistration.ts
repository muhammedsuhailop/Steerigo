import { useCallback, useEffect, useRef, useState } from "react";
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
import { getPincodeDetails } from "../services/pincodeService";
import { useRegisterDriverMutation } from "../services/driverRegistrationApi";
import { useUploadFileMutation } from "../services/driverRegistrationApi";

export const useDriverRegistration = () => {
  const dispatch = useAppDispatch();

  const [pinError, setPinError] = useState<string | null>(null);
  const [loadingPin, setLoadingPin] = useState(false);
  const lastFetchedPinRef = useRef<string | null>(null);

  // RTK Query mutations
  const [registerDriver] = useRegisterDriverMutation();
  const [uploadFileApi] = useUploadFileMutation();

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

  useEffect(() => {
    const pin = formData.pin;
    if (/^\d{6}$/.test(pin) && pin !== lastFetchedPinRef.current) {
      setLoadingPin(true);
      setPinError(null);
      lastFetchedPinRef.current = pin;

      getPincodeDetails(pin).then((res) => {
        setLoadingPin(false);
        if (res.success) {
          updateData({ state: res.data.state });
        } else {
          setPinError(res.error);
          dispatch(setErrors({ ...errors, pin: res.error }));
        }
      });
    }
  }, [formData.pin]);

  const goToNextStep = useCallback(() => {
    const validation = driverValidationService.validateStep(
      currentStep,
      formData
    );

    if (!validation.isValid) {
      dispatch(setErrors(validation.errors));
      scrollToFirstError(validation.errors);
      return false;
    }

    if (pinError) {
      dispatch(setErrors({ ...validation.errors, pin: pinError }));
      scrollToFirstError({ pin: pinError });
      return false;
    }

    dispatch(clearAllErrors());
    dispatch(nextStep());
    return true;
  }, [dispatch, currentStep, formData, pinError]);

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
    async (file: File, fieldName: string): Promise<UploadResponse> => {
      try {
        const purposeMap: Record<string, string> = {
          licenseFrontImage: "licenseFront",
          licenseBackImage: "licenseBack",
          idFrontImage: "kycdocFront",
          idBackImage: "kycdocBack",
          avatar: "avatar",
          insurance: "insurance",
        };

        const purpose = purposeMap[fieldName] || "document";

        const response = await uploadFileApi({ file, purpose }).unwrap();

        updateData({ [fieldName]: response.data.publicId });

        return {
          success: true,
          publicId: response.data.publicId,
          message: response.message,
        };
      } catch (error: any) {
        return {
          success: false,
          message: error.data?.message || "Upload failed",
        };
      }
    },
    [uploadFileApi, updateData]
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
    pinError,
    loadingPin,

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
