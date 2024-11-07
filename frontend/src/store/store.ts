import { configureStore } from "@reduxjs/toolkit";
import counterReducer from "./slices/counterSlice.ts";

// Create the Redux store
export const store = configureStore({
    reducer: {
        counter: counterReducer,
    },
    // middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(authApi.middleware), // Add middlewares
});

// Optional: Set up typed hooks (useDispatch, useSelector)
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
