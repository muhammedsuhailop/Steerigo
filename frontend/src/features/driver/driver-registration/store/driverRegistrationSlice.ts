import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  DriverRegistrationData,
  RegistrationStep,
  DriverRegistrationState,
} from "../types/driverRegistration.types";
import { RootState } from "@/app/store/store";

const initialState: DriverRegistrationState = {
  currentStep: RegistrationStep.PERSONAL_INFO,
  errors: {},
  uploadProgress: {},
  formData: {
    // Personal Info
    name: "",
    mobile: "",
    dob: "",
    gender: "Male",
    state: "",
    pin: "",
    address: "",

    // License Info
    licenseCategory: "LMV",
    licenseNumber: "",
    licenseBodyTypes: [],
    licenseGearTypes: [],
    licenseIssueDate: "",
    licenseExpiryDate: "",

    // ID Info
    idType: "PAN",
    idNumber: "",
    idIssueDate: "",
    idExpiryDate: "",

    // Documents
    licenseFrontImage: undefined,
    licenseBackImage: undefined,
    idFrontImage: undefined,
    idBackImage: undefined,
  },
  isSubmitting: false,
  registrationSuccess: false,
  registrationError: null,
};

const driverRegistrationSlice = createSlice({
  name: "driverRegistration",
  initialState,
  reducers: {
    updateFormData(
      state,
      action: PayloadAction<Partial<DriverRegistrationData>>
    ) {
      state.formData = { ...state.formData, ...action.payload };
      // Clear errors for updated fields
      Object.keys(action.payload).forEach((key) => {
        delete state.errors[key];
      });
    },

    setCurrentStep(state, action: PayloadAction<RegistrationStep>) {
      state.currentStep = action.payload;
    },

    nextStep(state) {
      if (state.currentStep < RegistrationStep.REVIEW) {
        state.currentStep += 1;
      }
    },

    previousStep(state) {
      if (state.currentStep > RegistrationStep.PERSONAL_INFO) {
        state.currentStep -= 1;
      }
    },

    setErrors(state, action: PayloadAction<Record<string, string>>) {
      state.errors = action.payload;
    },

    clearError(state, action: PayloadAction<string>) {
      delete state.errors[action.payload];
    },

    clearAllErrors(state) {
      state.errors = {};
    },

    updateUploadProgress(
      state,
      action: PayloadAction<{ fieldName: string; progress: number }>
    ) {
      const { fieldName, progress } = action.payload;
      state.uploadProgress[fieldName] = progress;
    },

    setSubmissionState(
      state,
      action: PayloadAction<{
        isSubmitting: boolean;
        success?: boolean;
        error?: string | null;
      }>
    ) {
      state.isSubmitting = action.payload.isSubmitting;
      if (action.payload.success !== undefined) {
        state.registrationSuccess = action.payload.success;
      }
      if (action.payload.error !== undefined) {
        state.registrationError = action.payload.error;
      }
    },

    resetForm(state) {
      return { ...initialState };
    },
  },
});

export const {
  updateFormData,
  setCurrentStep,
  nextStep,
  previousStep,
  setErrors,
  clearError,
  clearAllErrors,
  updateUploadProgress,
  setSubmissionState,
  resetForm,
} = driverRegistrationSlice.actions;

export default driverRegistrationSlice.reducer;

// Selectors
export const selectFormData = (state: RootState) =>
  state.driverRegistration.formData;

export const selectCurrentStep = (state: RootState) =>
  state.driverRegistration.currentStep;

export const selectErrors = (state: RootState) =>
  state.driverRegistration.errors;

export const selectUploadProgress = (state: RootState) =>
  state.driverRegistration.uploadProgress;

export const selectIsSubmitting = (state: RootState) =>
  state.driverRegistration.isSubmitting;

export const selectRegistrationSuccess = (state: RootState) =>
  state.driverRegistration.registrationSuccess;

export const selectRegistrationError = (state: RootState) =>
  state.driverRegistration.registrationError;
