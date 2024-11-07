import { createSlice } from "@reduxjs/toolkit";
import { RootState } from "../store";

// Create a simple slice with an initial state and one reducer
const counterSlice = createSlice({
    name: "counter",
    initialState: { value: 0 },
    reducers: {
        increment: (state, action) => {
            state.value += action.payload;
        },
    },
});

// Export the action for dispatching
export const { increment } = counterSlice.actions;

// Export the reducer to be added to the store
export default counterSlice.reducer;

// Export a selector for the counter value
export const getCounterValue = (state: RootState) => state.counter.value;
