import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import {
  DriverRegistrationData,
  RegistrationStep,
  UploadResponse,
  DriverRegistrationState,
} from "../types/driverRegistration.types";
import { driverValidationService } from "../services/driverValidation.service";

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

      // Return mock URL
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

// Async thunk for submitting registration
export const submitRegistration = createAsyncThunk<
  any,
  DriverRegistrationData,
  { rejectValue: string }
>(
  "driverRegistration/submitRegistration",
  async (driverData, { rejectWithValue }) => {
    try {
      // Final validation before submission
      const validation = driverValidationService.validateAll(driverData);
      if (!validation.isValid) {
        return rejectWithValue("Please fix validation errors");
      }

      const response = await fetch("/api/driver/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(driverData),
        credentials: "include",
      });

      if (!response.ok) {
        const errorData = await response.json();
        return rejectWithValue(errorData.message || "Registration failed");
      }

      const data = await response.json();
      return data;
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : "Registration failed"
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
      // Upload document cases
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

      // Submit registration cases
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

// Selectors
export const selectFormData = (state: {
  driverRegistration: DriverRegistrationState;
}) => state.driverRegistration.formData;

export const selectCurrentStep = (state: {
  driverRegistration: DriverRegistrationState;
}) => state.driverRegistration.currentStep;

export const selectErrors = (state: {
  driverRegistration: DriverRegistrationState;
}) => state.driverRegistration.errors;

export const selectIsLoading = (state: {
  driverRegistration: DriverRegistrationState;
}) => state.driverRegistration.isLoading;

export const selectUploadProgress = (state: {
  driverRegistration: DriverRegistrationState;
}) => state.driverRegistration.uploadProgress;

export const selectIsSubmitting = (state: {
  driverRegistration: DriverRegistrationState;
}) => state.driverRegistration.isSubmitting;

export const selectRegistrationSuccess = (state: {
  driverRegistration: DriverRegistrationState;
}) => state.driverRegistration.registrationSuccess;

export const selectRegistrationError = (state: {
  driverRegistration: DriverRegistrationState;
}) => state.driverRegistration.registrationError;
