import React, { useEffect } from "react";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import { store } from "./store";
import { AppRouter } from "@/routing/AppRouter";
import { initializeAuth } from "@/features/auth/store/authSlice";
import {
  ErrorBoundary,
  ToastContainer,
  GlobalErrorModal,
} from "@/shared/components/ui";

const AppContent: React.FC = () => {
  useEffect(() => {
    // Initialize auth state from localStorage on app load
    store.dispatch(initializeAuth());
  }, []);

  return (
    <>
      <AppRouter />

      {/* Global Error Handling Components */}
      <ToastContainer />
      <GlobalErrorModal />
    </>
  );
};

export const App: React.FC = () => {
  return (
    <Provider store={store}>
      <ErrorBoundary>
        <BrowserRouter>
          <AppContent />
        </BrowserRouter>
      </ErrorBoundary>
    </Provider>
  );
};
