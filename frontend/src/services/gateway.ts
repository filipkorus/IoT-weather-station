import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauth } from "./baseQueryWithReauth";
import { likesFromREST, slopeDataFromREST } from "@/store/slices/liveDataSlice";

interface Gateway {
    id: string;
    name: string;
    latitude: number;
    longitude: number;
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
    baseQuery: baseQueryWithReauth,
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
            query: () => ({
                url: "/public-gateway",
                method: "GET",
            }),
        }),
        getAllPrivateGateways: builder.query<{ gateways: Gateway[] }, void>({
            query: () => ({
                url: "/gateway",
                method: "GET",
            }),
            providesTags: [{ type: "Gateway", id: "PRIVATE_LIST" }],
        }),
        getGatewayMeasurements: builder.query({
            query: ({
                gatewayId = "3333",
                startDate = "2024-10-28T21:56:20.974Z",
                endDate = "2024-11-27T21:56:20.974Z",
            }) => {
                const url = `/measurements/gateway/${gatewayId}${
                    startDate || endDate ? "?" : ""
                }${startDate ? `startDate=${startDate}` : ""}${
                    startDate && endDate ? "&" : ""
                }${endDate ? `endDate=${endDate}` : ""}`;
                console.log("Final URL:", url); // Log the constructed URL
                return { url, method: "GET" }; // Return the query object
            },
        }),
    }),
    tagTypes: ["Gateway"],
});

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const {
    useGetPublicGatewayQuery,
    useGetAllPublicGatewaysQuery,
    useGetAllPrivateGatewaysQuery,
    useGetGatewayMeasurementsQuery,
} = gatewayApi;
