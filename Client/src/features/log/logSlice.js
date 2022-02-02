import { createSlice } from "@reduxjs/toolkit";
const initialState = {
    log: null,

}
const logSlice = createSlice({
    name: "log",
    initialState,
    reducers: {
        setLogs: (state, action) => {
            state.log = action.payload.log;

        }

    }
})


export const { setLogs } = logSlice.actions;

export const selectLog = (state) => state.log.log;

export default logSlice.reducer;