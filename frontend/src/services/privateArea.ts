import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauth } from "./baseQueryWithReauth";

export interface UsernamePassword {
    username: string;
    password: string;
}

// Define a service using a base URL and expected endpoints
export const privateAreaApi = createApi({
    reducerPath: "privateAreaApi",
    baseQuery: baseQueryWithReauth,
    endpoints: (builder) => ({
        pairingCode: builder.mutation<void, string>({
            query: (pairingCode) => ({
                url: "/gateway/pariring-code",
                method: "POST",
                body: { pairingCode },
            }),
        }),
    }),
    tagTypes: ["PrivateArea"],
});

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const { usePairingCodeMutation } = privateAreaApi;
