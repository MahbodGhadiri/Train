import { createSlice } from "@reduxjs/toolkit";
const initialState = {
    task: null,
    reload: false,
    click: false
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


        },
        setClick: (state, action)=>{
            state.click=action.payload.click
        }
    }
})


export const { setTasks , setReload , setClick } = taskSlice.actions;

export const selectTask = (state) => state.task.task;
export const selectReload = (state) => state.task.reload;
export const selectClick = (state)=> state.task.click;
export default taskSlice.reducer;