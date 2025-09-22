import { createSelector } from "@reduxjs/toolkit";
import { selectErrorsByContext } from "../../../shared/components/ui/ErrorHandling/errorSlice";
import { AuthContext } from "../../../shared/utils/errorUtils";
import type { RootState } from "@/app/store";

// Memoized selectors for auth errors
export const selectLoginErrors = createSelector(
  [(state: RootState) => state.error.errors],
  (errors) => errors.filter(error => error.context === AuthContext.LOGIN)
);

export const selectSignupErrors = createSelector(
  [(state: RootState) => state.error.errors],
  (errors) => errors.filter(error => error.context === AuthContext.SIGNUP)
);

export const selectOtpErrors = createSelector(
  [(state: RootState) => state.error.errors],
  (errors) => errors.filter(error => error.context === AuthContext.OTP_VERIFICATION)
);

export const selectPasswordResetErrors = createSelector(
  [(state: RootState) => state.error.errors],
  (errors) => errors.filter(error => error.context === AuthContext.PASSWORD_RESET)
);

export const selectGoogleAuthErrors = createSelector(
  [(state: RootState) => state.error.errors],
  (errors) => errors.filter(error => error.context === AuthContext.GOOGLE_AUTH)
);

// Generic memoized selector factory
export const createErrorSelector = (context: string) =>
  createSelector(
    [(state: RootState) => state.error.errors],
    (errors) => errors.filter(error => error.context === context)
  );