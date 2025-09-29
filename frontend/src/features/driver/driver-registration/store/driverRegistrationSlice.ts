import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import {
  DriverRegistrationData,
  RegistrationStep,
  UploadResponse,
  DriverRegistrationState,
} from "../types/driverRegistration.types";
import { driverValidationService } from "../services/driverValidation.service";
import { api } from "@/shared/utils/api";

const initialState: DriverRegistrationState = {
  currentStep: RegistrationStep.PERSONAL_INFO,
  isLoading: false,
  errors: {},
  uploadProgress: {},
  formData: {},
  isSubmitting: false,
  registrationSuccess: false,
  registrationError: null,
};

// Async thunk for uploading documents
// export const uploadDocument = createAsyncThunk<
//   UploadResponse,
//   { file: File; fieldName: string },
//   { rejectValue: string }
// >(
//   "driverRegistration/uploadDocument",
//   async ({ file, fieldName }, { dispatch, rejectWithValue }) => {
//     try {
//       const formData = new FormData();
//       formData.append("document", file);
//       formData.append("fieldName", fieldName);

//       // Create XMLHttpRequest for progress tracking
//       const xhr = new XMLHttpRequest();

//       const uploadPromise = new Promise<UploadResponse>((resolve, reject) => {
//         xhr.upload.addEventListener("progress", (event) => {
//           if (event.lengthComputable) {
//             const progress = Math.round((event.loaded / event.total) * 100);
//             dispatch(updateUploadProgress({ fieldName, progress }));
//           }
//         });

//         xhr.addEventListener("load", () => {
//           try {
//             if (xhr.status >= 200 && xhr.status < 300) {
//               const response = JSON.parse(xhr.responseText);
//               resolve({
//                 success: true,
//                 url: response.url,
//                 message: response.message
//               });
//             } else {
//               reject(new Error(`Upload failed: ${xhr.status}`));
//             }
//           } catch (error) {
//             reject(new Error("Invalid response"));
//           }
//         });

//         xhr.addEventListener("error", () => {
//           reject(new Error("Network error"));
//         });

//         xhr.open("POST", "/api/driver/upload-document");
//         xhr.send(formData);
//       });

//       return await uploadPromise;
//     } catch (error) {
//       return rejectWithValue(
//         error instanceof Error ? error.message : "Upload failed"
//       );
//     }
//   }
// );

export const uploadDocument = createAsyncThunk<
  UploadResponse,
  { file: File; fieldName: string },
  { rejectValue: string }
>(
  "driverRegistration/uploadDocument",
  async ({ file, fieldName }, { dispatch, rejectWithValue }) => {
    try {
      // Simulate upload progress
      for (let i = 0; i <= 100; i += 20) {
        await new Promise((resolve) => setTimeout(resolve, 100));
        dispatch(updateUploadProgress({ fieldName, progress: i }));
      }

      const mockUrl = `https://mockcdn.example.com/${fieldName}-${Date.now()}.jpg`;

      return {
        success: true,
        url: mockUrl,
        message: "Mock upload successful",
      };
    } catch (error) {
      return rejectWithValue("Mock upload failed");
    }
  }
);

export const submitRegistration = createAsyncThunk<
  any,
  FormData,
  { rejectValue: string }
>(
  "driverRegistration/submitRegistration",
  async (formData, { rejectWithValue }) => {
    try {
      const response = await api.post("/api/driver/register", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || error.message || "Registration failed"
      );
    }
  }
);

const driverRegistrationSlice = createSlice({
  name: "driverRegistration",
  initialState,
  reducers: {
    updateFormData: (
      state,
      action: PayloadAction<Partial<DriverRegistrationData>>
    ) => {
      state.formData = { ...state.formData, ...action.payload };
    },

    setCurrentStep: (state, action: PayloadAction<RegistrationStep>) => {
      state.currentStep = action.payload;
    },

    nextStep: (state) => {
      if (state.currentStep < RegistrationStep.REVIEW) {
        state.currentStep += 1;
      }
    },

    previousStep: (state) => {
      if (state.currentStep > RegistrationStep.PERSONAL_INFO) {
        state.currentStep -= 1;
      }
    },

    setErrors: (state, action: PayloadAction<Record<string, string>>) => {
      state.errors = action.payload;
    },

    clearError: (state, action: PayloadAction<string>) => {
      delete state.errors[action.payload];
    },

    clearAllErrors: (state) => {
      state.errors = {};
    },

    updateUploadProgress: (
      state,
      action: PayloadAction<{ fieldName: string; progress: number }>
    ) => {
      const { fieldName, progress } = action.payload;
      state.uploadProgress[fieldName] = progress;
    },

    resetForm: (state) => {
      return { ...initialState };
    },

    updateDocumentUrl: (
      state,
      action: PayloadAction<{ fieldName: string; url: string }>
    ) => {
      const { fieldName, url } = action.payload;
      state.formData = {
        ...state.formData,
        [fieldName]: url,
      };
    },

    clearRegistrationState: (state) => {
      state.registrationSuccess = false;
      state.registrationError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(uploadDocument.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(uploadDocument.fulfilled, (state, action) => {
        state.isLoading = false;
        if (action.payload.url && action.meta.arg.fieldName) {
          state.formData = {
            ...state.formData,
            [action.meta.arg.fieldName]: action.payload.url,
          };
        }
      })
      .addCase(uploadDocument.rejected, (state, action) => {
        state.isLoading = false;
        const fieldName = action.meta.arg.fieldName;
        state.errors[fieldName] = action.payload || "Upload failed";
      })
      .addCase(submitRegistration.pending, (state) => {
        state.isSubmitting = true;
        state.registrationError = null;
      })
      .addCase(submitRegistration.fulfilled, (state) => {
        state.isSubmitting = false;
        state.registrationSuccess = true;
        state.formData = {};
        state.currentStep = RegistrationStep.PERSONAL_INFO;
      })
      .addCase(submitRegistration.rejected, (state, action) => {
        state.isSubmitting = false;
        state.registrationError = action.payload || "Registration failed";
      });
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
  resetForm,
  updateDocumentUrl,
  clearRegistrationState,
} = driverRegistrationSlice.actions;

export default driverRegistrationSlice.reducer;

import type { RootState } from "@/app/store/rootReducer";

export const selectFormData = (state: RootState) =>
  state.driverRegistration.formData;

export const selectCurrentStep = (state: RootState) =>
  state.driverRegistration.currentStep;

export const selectErrors = (state: RootState) =>
  state.driverRegistration.errors;

export const selectIsLoading = (state: RootState) =>
  state.driverRegistration.isLoading;

export const selectUploadProgress = (state: RootState) =>
  state.driverRegistration.uploadProgress;

export const selectIsSubmitting = (state: RootState) =>
  state.driverRegistration.isSubmitting;

export const selectRegistrationSuccess = (state: RootState) =>
  state.driverRegistration.registrationSuccess;

export const selectRegistrationError = (state: RootState) =>
  state.driverRegistration.registrationError;
