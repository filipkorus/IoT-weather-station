import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQuery } from "./baseQuery";

interface Gateway {
    id: string;
    name: string;
    isPaired: boolean;
    isOnline: boolean;
    lastOnline: string;
    userId: string;
    nodes: [
        {
            id: string;
            name: string;
            gatewayId: string;
        },
    ];
}

interface PublicGateway extends Gateway {
    likes: number;
    haveYouLiked: boolean;
}

// interface PublicGatewayFromRequest extends PublicGateway {
//     sensorData:
// }

// Define a service using a base URL and expected endpoints
export const gatewayApi = createApi({
    reducerPath: "gatewayApi",
    baseQuery,
    endpoints: (builder) => ({
        getPublicGateway: builder.query<{ gateway: PublicGateway }, { gatewayId: string }>({
            query: ({ gatewayId }) => ({
                url: `/public-gateway/${gatewayId}`,
                method: "GET",
            }),
            providesTags: ["Gateway"],
        }),
        getAllPublicGateways: builder.query<{ gateways: PublicGateway[] }, void>({
            query: () => "/public-gateway",
        }),
    }),
    tagTypes: ["Gateway"],
});

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const { useGetPublicGatewayQuery, useGetAllPublicGatewaysQuery } = gatewayApi;
