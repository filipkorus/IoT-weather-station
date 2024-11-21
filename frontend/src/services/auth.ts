import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQuery } from "./baseQuery";

// Define a service using a base URL and expected endpoints
export const authApi = createApi({
    reducerPath: "authApi",
    baseQuery,
    endpoints: (builder) => ({
        register: builder.mutation<void, { username: string; password: string }>({
            query: ({ username, password }) => ({
                url: "/auth/register",
                method: "POST",
                body: { username, password },
            }),
        }),
        login: builder.mutation<void, { username: string; password: string }>({
            query: ({ username, password }) => ({
                url: "/auth/login",
                method: "POST",
                body: { username, password },
            }),
        }),
    }),
    tagTypes: ["Auth"],
});

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const { useRegisterMutation, useLoginMutation } = authApi;
