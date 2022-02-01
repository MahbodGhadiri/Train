import { createSlice } from "@reduxjs/toolkit";
const initialState = {
    singleTask: null,

}
const singleTaskSlice = createSlice({
    name: "singleTask",
    initialState,
    reducers: {
        setSingleTasks: (state, action) => {
            state.singleTask = action.payload.singleTask;

        }

    }
})


export const { setSingleTasks } = singleTaskSlice.actions;

export const selectSingleTask = (state) => state.singleTask.singleTask;

export default singleTaskSlice.reducer;