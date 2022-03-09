import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from 'axios'
import { checklogin } from "../../components/CheckLogin";

//creating async logic using createAsyncThunk
export const fetchAdminTasks= createAsyncThunk('task/fetchAdminTasks', async(filter) =>{
    //making sure we wont pass undefined in url
    if (filter==undefined){
        filter=""
    }
    // returning a promise to createAsyncThunk (do not use "await")
    return axios
    .get(`/admin/tasks/?${filter}`,{ headers: { 'Content-Type': 'application/json' }, withCredentials: true })
})

const initialState = {
    tasks: undefined,
    toBeEditedTask: undefined,
    reload: false, //TODO remove this
    click: false,   //TODO remove this
    status:"idle", // idle status will cause api being called
    error: null,
    filter: "",
}
const adminTasksSlice = createSlice({
    name: "adminTasks",
    initialState,
    reducers: {
        setTasks: (state, action) => { //TODO remove this
            state.tasks = action.payload.task;
        },

        setReload: (state, action) => {
            state.reload = action.payload.reload;
        },

        addTask: (state, action) => {   //TODO remove this
            state.tasks = action.payload.task;
        },

        setClick: (state, action)=>{    //TODO remove this
            state.click = action.payload.click
        },

        setTasksStatus: (state, action) => {
            state.status = action.payload.status;
        },

        setTasksFilter: (state, action) => {
            state.filter = action.payload.filter;
            state.status = "idle"
        },

        setToBeEditedTask:(state, action) => {
            state.toBeEditedTask = action.payload.toBeEditedTask;
            console.log(action.payload.toBeEditedTask)
        }
    },
    // using extraReducers to create reducers for specific cases
    extraReducers(builder)  {
        builder
            // case for the time wating for response
            .addCase(fetchAdminTasks.pending, (state,action)=>{
                state.status= 'loading';
            })
            // case for fullfiled promise
            .addCase(fetchAdminTasks.fulfilled,(state,action)=>{
                state.tasks = action.payload.data.tasks;
                state.status = 'succeed';
            })
            // case for rejected promise
            .addCase(fetchAdminTasks.rejected, (state, action)=>{
                state.error= action.payload.error.message;
                state.status= 'failed';
                checklogin(action.payload.error);
            })
    }
})



//TODO remove "setTasks", "setReload", "setClick" exports
export const { setTasks , setReload , setClick, setTasksStatus, setTasksFilter, setToBeEditedTask } = adminTasksSlice.actions;

export const selectAdminTasks = (state) => state.adminTasks.tasks;
export const selectReload = (state) => state.adminTasks.reload; //TODO remove this
export const selectClick = (state)=> state.adminTasks.click; //TODO remove this
export const selectAdminTasksFilter = (state)=> state.adminTasks.filter;
export const selectToBeEditedTask = (state)=> state.adminTasks.toBeEditedTask;
export default adminTasksSlice.reducer;