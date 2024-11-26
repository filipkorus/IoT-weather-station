import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQuery } from "./baseQuery";

export interface UsernamePassword {
    username: string;
    password: string;
}

// Define a service using a base URL and expected endpoints
export const authApi = createApi({
    reducerPath: "authApi",
    baseQuery,
    endpoints: (builder) => ({
        register: builder.mutation<void, UsernamePassword>({
            query: ({ username, password }) => ({
                url: "/auth/register",
                method: "POST",
                body: { username, password },
            }),
        }),
        login: builder.mutation<{ token: string }, UsernamePassword>({
            query: ({ username, password }) => ({
                url: "/auth/login",
                method: "POST",
                body: { username, password },
            }),
        }),
        logout: builder.mutation<void, void>({
            query: () => ({
                url: "/auth/logout",
                method: "GET",
            }),
        }),
    }),
    tagTypes: ["Auth"],
});

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const { useRegisterMutation, useLoginMutation, useLogoutMutation } = authApi;
