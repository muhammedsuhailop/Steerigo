import React, { useEffect } from "react";
import { Provider, useDispatch } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import { store } from "./store/store";
import { AppRouter } from "@/routing/AppRouter";
import { initializeAuth } from "@/features/auth/store/authSlice";
import { ErrorDispatcher } from "@/shared/api/services/errorDispatcherService";
import { ErrorBoundary, ToastContainer } from "@/shared/components/ui";
import { useSocket } from "@/shared/socket/useSocket";
import { useAppSelector } from "./store/hooks";
import { SocketContext } from "@/shared/socket/SocketContext";

const AppContent: React.FC = () => {
  const dispatch = useDispatch();
  const accessToken = useAppSelector((state) => state.auth.accessToken);

  const socketReady = useSocket({
    accessToken,
  });

  useEffect(() => {
    ErrorDispatcher.setDispatch(dispatch);
    store.dispatch(initializeAuth());
  }, [dispatch]);

  return (
    <SocketContext.Provider value={{ socketReady }}>
      <ErrorBoundary>
        <AppRouter />
        <ToastContainer />
      </ErrorBoundary>
    </SocketContext.Provider>
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
