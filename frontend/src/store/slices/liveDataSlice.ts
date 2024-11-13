import { createSlice } from "@reduxjs/toolkit";
import { RootState } from "../store";

interface _CommonDataNoCreated {
    batteryLevel: number;
    temperature: number;
    humidity: number;
    pressure: number;
    snowDepth: number;
    pm1: number;
    pm25: number;
    pm10: number;
}

interface _CommonData extends _CommonDataNoCreated {
    created: string;
}

interface SensorsToClient {
    gatewayId: string;
    created: string;
    data: _CommonDataNoCreated; // we want to keep length up to 5
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
                    state[data.gatewayId] = { data: [], likes: 0, haveYouLiked: false };
                }
                state[data.gatewayId].data = [];
            }
            state[data.gatewayId].data.unshift({ ...data.data, created: data.created });
        },
        likes: (state, action) => {
            const data = action.payload as Likes;
            // Update the likes property for a specific gateway
            if (state[data.gatewayId]) {
                state[data.gatewayId].likes = data.likes;
            }
        },
    },
});

// Export the action for dispatching
export const { sensorsToClient } = liveDataSlice.actions;

// Export the reducer to be added to the store
export default liveDataSlice.reducer;

// Export a selector for the counter value
export const getLiveData = (state: RootState) => state.liveData;
