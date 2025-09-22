import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { BaseError, ErrorState, ErrorSeverity } from "./ErrorHandling.types";

const initialState: ErrorState = {
  errors: [],
  globalError: null,
  isVisible: false,
};

const errorSlice = createSlice({
  name: "error",
  initialState,
  reducers: {
    addError: (state, action: PayloadAction<BaseError>) => {
      const error = action.payload;

      // Remove duplicate errors
      state.errors = state.errors.filter(
        (e) =>
          !(
            e.code === error.code &&
            e.type === error.type &&
            e.field === error.field
          )
      );

      // Add new error
      state.errors.push(error);

      // Set as global error if critical or high severity
      if (
        error.severity === ErrorSeverity.CRITICAL ||
        error.severity === ErrorSeverity.HIGH
      ) {
        state.globalError = error;
        state.isVisible = true;
      }
    },

    removeError: (state, action: PayloadAction<string>) => {
      const errorCode = action.payload;
      state.errors = state.errors.filter((error) => error.code !== errorCode);

      // Clear global error if it's the one being removed
      if (state.globalError?.code === errorCode) {
        state.globalError = null;
        state.isVisible = false;
      }
    },

    clearErrors: (state) => {
      state.errors = [];
      state.globalError = null;
      state.isVisible = false;
    },

    clearErrorsByType: (state, action: PayloadAction<string>) => {
      const errorType = action.payload;
      state.errors = state.errors.filter((error) => error.type !== errorType);

      if (state.globalError?.type === errorType) {
        state.globalError = null;
        state.isVisible = false;
      }
    },

    clearErrorsByContext: (state, action: PayloadAction<string>) => {
      const context = action.payload;
      state.errors = state.errors.filter((error) => error.context !== context);

      if (state.globalError?.context === context) {
        state.globalError = null;
        state.isVisible = false;
      }
    },

    clearErrorsByField: (state, action: PayloadAction<string>) => {
      const field = action.payload;
      state.errors = state.errors.filter((error) => error.field !== field);
    },

    setGlobalError: (state, action: PayloadAction<BaseError | null>) => {
      state.globalError = action.payload;
      state.isVisible = !!action.payload;
    },

    hideGlobalError: (state) => {
      state.isVisible = false;
    },

    showGlobalError: (state) => {
      if (state.globalError) {
        state.isVisible = true;
      }
    },
  },
});

export const {
  addError,
  removeError,
  clearErrors,
  clearErrorsByType,
  clearErrorsByContext,
  clearErrorsByField,
  setGlobalError,
  hideGlobalError,
  showGlobalError,
} = errorSlice.actions;

export default errorSlice.reducer;

// Selectors
export const selectErrors = (state: { error: ErrorState }) =>
  state.error.errors;
export const selectGlobalError = (state: { error: ErrorState }) =>
  state.error.globalError;
export const selectIsErrorVisible = (state: { error: ErrorState }) =>
  state.error.isVisible;
export const selectErrorsByType =
  (type: string) => (state: { error: ErrorState }) =>
    state.error.errors.filter((error) => error.type === type);
export const selectErrorsByField =
  (field: string) => (state: { error: ErrorState }) =>
    state.error.errors.filter((error) => error.field === field);
export const selectErrorsByContext =
  (context: string) => (state: { error: ErrorState }) =>
    state.error.errors.filter((error) => error.context === context);
