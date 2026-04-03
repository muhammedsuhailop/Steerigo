import { configureStore } from "@reduxjs/toolkit";
import { rootReducer, apiMiddlewares } from "./rootReducer";

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ["error/addError"],
        ignoredPaths: ["error.errors.timestamp", "error.globalError.timestamp"],
      },
    }).concat(...apiMiddlewares),
  devTools: import.meta.env.DEV,
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
