import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauth } from "./baseQueryWithReauth";

export interface UsernamePassword {
    username: string;
    password: string;
}

export interface UpdateGatewayInfo {
    name?: string;
    latitude?: number;
    longitude?: number;
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
        updateGatewayInfo: builder.mutation<void, { infoToUpdate: UpdateGatewayInfo; gatewayId: string }>({
            query: ({ infoToUpdate, gatewayId }) => ({
                url: `/gateway/${gatewayId}`,
                method: "PUT",
                body: infoToUpdate,
            }),
        }),
    }),
    tagTypes: ["PrivateArea"],
});

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const { usePairingCodeMutation, useUpdateGatewayInfoMutation } = privateAreaApi;
