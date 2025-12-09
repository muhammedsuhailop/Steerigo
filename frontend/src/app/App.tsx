import React, { useEffect } from "react";
import { Provider, useDispatch } from "react-redux"; 
import { BrowserRouter } from "react-router-dom";
import { store } from "./store";
import { AppRouter } from "@/routing/AppRouter";
import { initializeAuth } from "@/features/auth/store/authSlice";
import { ErrorDispatcher } from "@/shared/api/services/errorDispatcherService"; 
import {
  ErrorBoundary,
  ToastContainer,
} from "@/shared/components/ui";

const AppContent: React.FC = () => {
  const dispatch = useDispatch(); 

  useEffect(() => {
    ErrorDispatcher.setDispatch(dispatch);

    // Initialize auth state from localStorage on app load
    store.dispatch(initializeAuth());
  }, [dispatch]); 

  return (
    <>
      {/* Global Error Handling Components */}
      <ErrorBoundary>
        <AppRouter />
        <ToastContainer />
      </ErrorBoundary>
    </>
  );
};

export const App: React.FC = () => {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </Provider>
  );
};
