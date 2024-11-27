import { createSlice } from "@reduxjs/toolkit";
import { RootState } from "../store";

interface _CommonData {
    batteryLevel: number;
    temperature: number;
    humidity: number;
    pressure: number;
    snowDepth: number;
    pm1: number;
    pm25: number;
    pm10: number;
    created: string;
}

interface SensorsToClient {
    gatewayId: string;
    sensorData: _CommonData; // we want to keep length up to 5
}

interface Likes {
    gatewayId: string;
    likes: number;
}

interface LiveData {
    [gatewayId: string]: {
        data: Array<_CommonData>; // we want to keep length up to 5
        likes: number;
        haveYouLiked: boolean;
    };
}

const stateDataGatewayIdInitState = { data: [], likes: 0, haveYouLiked: false };

// Set initial state to an empty LiveData object
const initialState: LiveData = {};

// Create the slice
const liveDataSlice = createSlice({
    name: "liveData",
    initialState,
    reducers: {
        sensorsToClient: (state, action) => {
            const data = action.payload as SensorsToClient;
            // Set or update the gateway data
            if (state[data.gatewayId]?.data?.length >= 5) {
                state[data.gatewayId].data.pop();
                if (state[data.gatewayId].data.length >= 5) {
                    state[data.gatewayId].data.pop();
                }
            }

            if (!state[data.gatewayId]?.data) {
                if (!state[data.gatewayId]) {
                    state[data.gatewayId] = { ...stateDataGatewayIdInitState };
                }
                state[data.gatewayId].data = [];
            }
            state[data.gatewayId].data.unshift({ ...data.sensorData });
        },
        likes: (state, action) => {
            const data = action.payload as Likes;
            // Update the likes property for a specific gateway
            if (state[data.gatewayId]) {
                state[data.gatewayId].likes = data.likes;
            }
        },
        likesFromREST: (state, action) => {
            const data = action.payload as { likes: number; gatewayId: string; haveYouLiked: boolean };

            if (!state[data.gatewayId]) {
                state[data.gatewayId] = { ...stateDataGatewayIdInitState };
            }

            state[data.gatewayId].likes = data.likes;
            state[data.gatewayId].haveYouLiked = data.haveYouLiked;
        },
        slopeDataFromREST: (state, action) => {
            const data = action.payload as {
                gateway: { id: string; likes: number; haveYouLiked: boolean; sensorData: Array<_CommonData> };
            };

            state[data.gateway.id] = {
                likes: data.gateway.likes,
                haveYouLiked: data.gateway.haveYouLiked,
                data: data.gateway.sensorData,
            };
        },
    },
});

// Export the action for dispatching
export const { sensorsToClient, likes, likesFromREST, slopeDataFromREST } = liveDataSlice.actions;

// Export the reducer to be added to the store
export default liveDataSlice.reducer;

// Export a selector for the counter value
export const getLiveData = (state: RootState) => state.liveData;
