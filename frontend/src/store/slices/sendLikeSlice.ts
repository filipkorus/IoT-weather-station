import { createSlice } from "@reduxjs/toolkit";
import { RootState } from "../store";

// Create a simple slice with an initial state and one reducer
const sendLikeSlice = createSlice({
    name: "sendLike",
    initialState: { gatewayId: "", idFromURL: "" },
    reducers: {
        setGatewayId: (state, action) => {
            state.gatewayId = action.payload;
        },
        setIdFromURL: (state, action) => {
            state.idFromURL = action.payload;
        },
    },
});

// Export the action for dispatching
export const { setGatewayId, setIdFromURL } = sendLikeSlice.actions;

// Export the reducer to be added to the store
export default sendLikeSlice.reducer;

// Export a selector for the gatewayId value
export const getGatewayId = (state: RootState) => state.sendLike.gatewayId;
export const getIdFromURL = (state: RootState) => state.sendLike.idFromURL;
