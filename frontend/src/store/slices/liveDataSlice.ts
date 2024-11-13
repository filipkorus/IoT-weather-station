import { createSlice } from "@reduxjs/toolkit";
import { RootState } from "../store";

interface CommonData {
    created: string;
    batteryLevel: number;
    temperature: number;
    humidity: number;
    pressure: number;
    snowDepth: number;
    pm1: number;
    pm25: number;
    pm10: number;
}

interface SensorsToClient {
    gatewayId: string;
    created: string;
    data: CommonData; // we want to keep length up to 5
}

interface Likes {
    gatewayId: string;
    likes: number;
}

interface LiveData {
    [gatewayId: string]: {
        created: string;
        data: Array<CommonData>; // we want to keep length up to 5
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
            console.log("AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA");
            console.log("data:");
            console.log(data);

            // Set or update the gateway data
            if (state[data.gatewayId].data.length >= 5) {
                state[data.gatewayId].data.shift();
                if (state[data.gatewayId].data.length >= 5) {
                    state[data.gatewayId].data.shift();
                }
            }
            state[data.gatewayId].created = data.created;
            if (!state[data.gatewayId].data) {
                state[data.gatewayId].data = [];
            }
            console.log("data.data:");
            console.log(data.data);

            state[data.gatewayId].data.push(data.data);
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
