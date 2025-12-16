import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { BaseError, ErrorState, ErrorSeverity } from "./ErrorHandling.types";

const initialState: ErrorState = {
  errors: [],
  lastError: null,
};

const errorSlice = createSlice({
  name: "error",
  initialState,
  reducers: {
    // Add error and show as toast
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
      state.lastError = error;
    },

    // Remove error by code
    removeError: (state, action: PayloadAction<string>) => {
      const errorCode = action.payload;
      state.errors = state.errors.filter((error) => error.code !== errorCode);
    },

    // Clear specific error by index (for auto-removal after toast closes)
    clearErrorByIndex: (state, action: PayloadAction<number>) => {
      state.errors.splice(action.payload, 1);
    },

    // Clear all errors
    clearErrors: (state) => {
      state.errors = [];
      state.lastError = null;
    },

    // Clear errors by type
    clearErrorsByType: (state, action: PayloadAction<string>) => {
      const errorType = action.payload;
      state.errors = state.errors.filter((error) => error.type !== errorType);
    },

    // Clear errors by context
    clearErrorsByContext: (state, action: PayloadAction<string>) => {
      const context = action.payload;
      state.errors = state.errors.filter((error) => error.context !== context);
    },

    // Clear errors by field
    clearErrorsByField: (state, action: PayloadAction<string>) => {
      const field = action.payload;
      state.errors = state.errors.filter((error) => error.field !== field);
    },
  },
});

export const {
  addError,
  removeError,
  clearErrorByIndex,
  clearErrors,
  clearErrorsByType,
  clearErrorsByContext,
  clearErrorsByField,
} = errorSlice.actions;

export default errorSlice.reducer;

// Selectors
export const selectErrors = (state: { error: ErrorState }) =>
  state.error.errors;

export const selectLastError = (state: { error: ErrorState }) =>
  state.error.lastError;

export const selectErrorsByType =
  (type: string) => (state: { error: ErrorState }) =>
    state.error.errors.filter((error) => error.type === type);

export const selectErrorsByField =
  (field: string) => (state: { error: ErrorState }) =>
    state.error.errors.filter((error) => error.field === field);

export const selectErrorsByContext =
  (context: string) => (state: { error: ErrorState }) =>
    state.error.errors.filter((error) => error.context === context);
