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
        .get(`/admin/tasks/?${filter}`)
}) 

const initialState = {
    tasks: undefined,
    toBeEditedTask: undefined,
    status:"idle", // idle status will cause api being called
    error: null,
    filter: "",
}
const adminTasksSlice = createSlice({
    name: "adminTasks",
    initialState,
    reducers: {
        setTasksStatus: (state, action) => {
            state.status = action.payload.status;
        },

        setTasksFilter: (state, action) => {
            state.filter = action.payload.filter;
            state.status = "idle"
        },

        setToBeEditedTask:(state, action) => {
            state.toBeEditedTask = action.payload.toBeEditedTask;
        }
    },
    // using extraReducers to create reducers for specific cases
    extraReducers(builder)  {
        builder
            // case for the time wating for response
            .addCase(fetchAdminTasks.pending, (state)=>{
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

export const { setTasksStatus, setTasksFilter, setToBeEditedTask } = adminTasksSlice.actions;

export const selectAdminTasks = (state) => state.adminTasks.tasks;
export const selectAdminTasksFilter = (state)=> state.adminTasks.filter;
export const selectToBeEditedTask = (state)=> state.adminTasks.toBeEditedTask;
export default adminTasksSlice.reducer;