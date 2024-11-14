import { createSlice } from "@reduxjs/toolkit";
import { RootState } from "../store";

// Create a simple slice with an initial state and one reducer
const sendLikeSlice = createSlice({
    name: "sendLike",
    initialState: { gatewayId: "" },
    reducers: {
        setGatewayId: (state, action) => {
            state.gatewayId = action.payload;
        },
    },
});

// Export the action for dispatching
export const { setGatewayId } = sendLikeSlice.actions;

// Export the reducer to be added to the store
export default sendLikeSlice.reducer;

// Export a selector for the gatewayId value
export const getGatewayId = (state: RootState) => state.sendLike.gatewayId;
