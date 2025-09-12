import { createSelector } from "@reduxjs/toolkit";
import type { RootState } from "../../../app/store";

const selectAuthState = (state: RootState) => state.auth;

export const selectCurrentUser = createSelector(
  [selectAuthState],
  (auth) => auth.user
);

export const selectIsAuthenticated = createSelector(
  [selectAuthState],
  (auth) => auth.isAuthenticated
);

export const selectAuthToken = createSelector(
  [selectAuthState],
  (auth) => auth.token
);

export const selectRefreshToken = createSelector(
  [selectAuthState],
  (auth) => auth.refreshToken
);

export const selectAuthLoading = createSelector(
  [selectAuthState],
  (auth) => auth.isLoading
);

export const selectAuthError = createSelector(
  [selectAuthState],
  (auth) => auth.error
);

export const selectUserRole = createSelector(
  [selectCurrentUser],
  (user) => user?.role
);

export const selectIsEmailVerified = createSelector(
  [selectCurrentUser],
  (user) => user?.isEmailVerified ?? false
);

export const selectUserFullName = createSelector([selectCurrentUser], (user) =>
  user ? `${user.name}` : ""
);

export const selectCanAccessAdminPanel = createSelector(
  [selectUserRole, selectIsAuthenticated],
  (role, isAuthenticated) => isAuthenticated && role === "Admin"
);

export const selectCanAccessDriverPanel = createSelector(
  [selectUserRole, selectIsAuthenticated],
  (role, isAuthenticated) =>
    isAuthenticated && (role === "Driver" || role === "Admin")
);
