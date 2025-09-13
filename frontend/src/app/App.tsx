import React, { useEffect } from "react";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import { store } from "./store";
import { AppRouter } from "@/routing";
import { initializeAuth } from "@/features/auth/store/authSlice";

const AppContent: React.FC = () => {
  useEffect(() => {
    // Initialize auth state from localStorage on app load
    store.dispatch(initializeAuth());
  }, []);

  return <AppRouter />;
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
