import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from 'axios'
import { checklogin } from "../../components/CheckLogin";

//creating async logic using createAsyncThunk
export const fetchCustomTasks= createAsyncThunk('task/fetchCustomTasks', async(filter) =>{
    //making sure we wont pass undefined in url
    if (filter==undefined){
        filter=""
    }
    // returning a promise to createAsyncThunk (do not use "await")
    return axios
        .get(`/user/custom-tasks/?${filter}`)
})

const initialState = {
    tasks: undefined,
    status:"idle", // idle status will cause api being called
    error: null,
    filter: "",
}
const customTasksSlice = createSlice({
    name: "customTasks",
    initialState,
    reducers: {
        setCustomTasksStatus: (state, action) => {
            state.status = action.payload.status;
        },
        setCustomTasksFilter: (state, action) => {
            state.filter = action.payload.filter;
            state.status = "idle"
        },
        setToBeEditedTask:(state, action) => {
            state.toBeEditedTask = action.payload.toBeEditedTask;
        }
    },
    // using extrareducers to create reducers for specific cases
    extraReducers(builder)  {
        builder
            // case for the time wating for response
            .addCase(fetchCustomTasks.pending, (state,action)=>{
                state.status= 'loading';
            })
            // case for fullfiled promise
            .addCase(fetchCustomTasks.fulfilled,(state,action)=>{
                state.tasks = action.payload.data;
                state.status = 'succeed';
            })
            // case for rejected promise
            .addCase(fetchCustomTasks.rejected, (state, action)=>{
                state.error= action.payload.error.message;
                state.status= 'failed';
                checklogin(action.payload.error)
            })
    }
})

export const { setCustomTasksStatus, setCustomTasksFilter, setToBeEditedTask } = customTasksSlice.actions;

export const selectCustomTasks = (state) => state.customTasks.tasks;
export const selectCustomTasksFilter = (state)=> state.customTasks.filter;
export const selectToBeEditedTask = (state)=> state.customTasks.toBeEditedTask
export default customTasksSlice.reducer;