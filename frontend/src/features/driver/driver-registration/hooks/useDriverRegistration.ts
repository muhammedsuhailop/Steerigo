import { useCallback, useEffect, useRef, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/app/store/hooks";
import { selectCurrentUser } from "@/features/auth/store/authSlice";
import { useNavigate } from "react-router-dom";
import {
  updateFormData,
  setCurrentStep,
  nextStep,
  previousStep,
  setErrors,
  clearError,
  clearAllErrors,
  resetForm,
  setSubmissionState,
  selectFormData,
  selectCurrentStep,
  selectErrors,
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
import {
  useRegisterDriverMutation,
  useUploadFileMutation,
} from "../services/driverRegistrationApi";

export const useDriverRegistration = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const currentUser = useAppSelector(selectCurrentUser);

  const [pinError, setPinError] = useState<string | null>(null);
  const [loadingPin, setLoadingPin] = useState(false);
  const lastFetchedPinRef = useRef<string | null>(null);

  // RTK Query mutations
  const [registerDriver, { isLoading: isRegisterLoading }] =
    useRegisterDriverMutation();
  const [uploadFileApi, { isLoading: isUploadLoading }] =
    useUploadFileMutation();

  // Selectors
  const formData = useAppSelector(selectFormData);
  const currentStep = useAppSelector(selectCurrentStep);
  const errors = useAppSelector(selectErrors);
  const uploadProgress = useAppSelector(selectUploadProgress);
  const isSubmitting = useAppSelector(selectIsSubmitting);
  const registrationSuccess = useAppSelector(selectRegistrationSuccess);
  const registrationError = useAppSelector(selectRegistrationError);

  // Combined loading state
  const isLoading = isRegisterLoading || isUploadLoading;

  const updateData = useCallback(
    (data: Partial<DriverRegistrationData>, validateStep: boolean = false) => {
      dispatch(updateFormData(data));
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
    [dispatch, formData, currentStep]
  );

  useEffect(() => {
    if (currentUser) {
      console.log(currentUser);
      dispatch(
        updateFormData({
          name: currentUser.name || "",
          mobile: currentUser.mobile || "",
        })
      );
    }
  }, [currentUser, dispatch]);

  // PIN validation effect
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
  }, [formData.pin, errors, dispatch, updateData]);

  // Navigation handlers
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

  // File upload handler
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

        if (response.success) {
          updateData({ [fieldName]: response.data.url });
          return {
            success: true,
            publicId: response.data.publicId,
            message: response.message,
          };
        } else {
          return {
            success: false,
            message: response.message || "Upload failed",
          };
        }
      } catch (error: any) {
        return {
          success: false,
          message: error.data?.message || "Upload failed",
        };
      }
    },
    [uploadFileApi, updateData]
  );

  // Registration submission
  const handleSubmitRegistration = useCallback(async () => {
    console.log("handleSubmitRegistration called");
    const validation = driverValidationService.validateAll(
      formData as DriverRegistrationData
    );
    if (!validation.isValid) {
      dispatch(setErrors(validation.errors));
      return { success: false, errors: validation.errors };
    }

    dispatch(setSubmissionState({ isSubmitting: true }));

    try {
      const result = await registerDriver(
        formData as DriverRegistrationData
      ).unwrap();

      if (!result.success) {
        dispatch(
          setSubmissionState({
            isSubmitting: false,
            success: false,
            error: result.message || "Registration failed",
          })
        );
        dispatch(setErrors({ form: result.message || "Registration failed" }));
        return { success: false, error: result.message };
      }

      dispatch(
        setSubmissionState({
          isSubmitting: false,
          success: true,
          error: null,
        })
      );

      // Navigate to dashboard after delay
      setTimeout(() => {
        dispatch(resetForm());
        navigate("/dashboard");
      }, 3000);

      return { success: true, data: result.data };
    } catch (error: any) {
      const errorMessage = error.data?.message || "Registration failed";
      dispatch(
        setSubmissionState({
          isSubmitting: false,
          success: false,
          error: errorMessage,
        })
      );
      dispatch(setErrors({ form: errorMessage }));
      return { success: false, error: errorMessage };
    }
  }, [dispatch, formData, registerDriver, navigate]);

  const resetRegistrationForm = useCallback(() => {
    dispatch(resetForm());
  }, [dispatch]);

  // Validation methods
  const validateCurrentStep = useCallback((): ValidationResult => {
    return driverValidationService.validateStep(currentStep, formData);
  }, [currentStep, formData]);

  const validateForm = useCallback((): ValidationResult => {
    return driverValidationService.validateAll(
      formData as DriverRegistrationData
    );
  }, [formData]);

  // Utility methods
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
