import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQuery } from "./baseQuery";
import { likesFromREST, slopeDataFromREST } from "@/store/slices/liveDataSlice";

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
    latitude: number;
    longitude: number;
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
            // `onQueryStarted` is triggered when the query is initiated
            async onQueryStarted(arg, { dispatch, queryFulfilled }) {
                try {
                    // Await the result of the query
                    const { data } = await queryFulfilled;
                    // Automatically dispatch your action with the fetched data
                    if (
                        data?.gateway?.likes != null &&
                        data?.gateway?.id != null &&
                        data?.gateway?.haveYouLiked != null
                    ) {
                        dispatch(
                            likesFromREST({
                                likes: data.gateway.likes,
                                gatewayId: data.gateway.id,
                                haveYouLiked: data.gateway.haveYouLiked,
                            }),
                        );
                        dispatch(slopeDataFromREST(data));
                    }
                } catch (error) {
                    console.error("Error fetching data:", error);
                }
            },
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
