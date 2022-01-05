import { createSlice } from "@reduxjs/toolkit";
const initialState = {
    task: null,
    reload: false,
}
const taskSlice = createSlice({
    name: "task",
    initialState,
    reducers: {
        setTasks: (state, action) => {
            state.task = action.payload.task;


        },
        setReload: (state, action) => {
            state.reload = action.payload.reload;


        },
        addTask: (state, action) => {
            state.task = action.payload.task;


        }
    }
})


export const { setTasks , setReload } = taskSlice.actions;

export const selectTask = (state) => state.task.task;
export const selectReload = (state) => state.task.reload;
export default taskSlice.reducer;