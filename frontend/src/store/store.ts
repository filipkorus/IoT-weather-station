import { configureStore } from "@reduxjs/toolkit";
import counterReducer from "./slices/counterSlice.ts";
import { authApi } from "../services/auth";
import { gatewayApi } from "@/services/gateway.ts";
import liveDataReducer from "./slices/liveDataSlice.ts";
import sendLikeSlice from "./slices/sendLikeSlice.ts";

// Create the Redux store
export const store = configureStore({
    reducer: {
        counter: counterReducer,
        [authApi.reducerPath]: authApi.reducer,
        [gatewayApi.reducerPath]: gatewayApi.reducer,
        liveData: liveDataReducer,
        sendLike: sendLikeSlice,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(authApi.middleware).concat(gatewayApi.middleware), // Add middlewares
});

// Optional: Set up typed hooks (useDispatch, useSelector)
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
