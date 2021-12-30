import { createSlice } from "@reduxjs/toolkit";
const initialState = {
    pin: [],
    reload: false,
}
const pinSlice = createSlice({
    name: "pin",
    initialState,
    reducers: {
        setPins: (state, action) => {
            state.pin = action.payload.pin;


        },
        setReload: (state, action) => {
            state.reload = action.payload.reload;


        },
    }
})

export const { setPins, setReload } = pinSlice.actions;

export const selectReload = (state) => state.pin.reload;
export const selectPin = (state) =>state.pin.pin;


export default pinSlice.reducer;