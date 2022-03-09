import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from 'axios'
import { checklogin } from "../../components/CheckLogin";

//creating async logic using createAsyncThunk
export const fetchUserTasks= createAsyncThunk('task/fetchUserTasks', async(filter) =>{
    //making sure we wont pass undefined in url
    if (filter==undefined){
        filter=""
    }
    // returning a promise to createAsyncThunk (do not use "await")
    return axios
    .get(`/user/tasks/?${filter}`)
})

const initialState = {
    tasks: undefined,
    status:"idle", // idle status will cause api being called
    error: null,
    filter: "",
}
const userTasksSlice = createSlice({
    name: "userTasks",
    initialState,
    reducers: {
        setTasksStatus: (state, action) => {
            state.status = action.payload.status;
        },
        setTasksFilter: (state, action) => {
            state.filter = action.payload.filter;
            state.status = "idle"
        },
    },
    // using extrareducers to create reducers for specific cases
    extraReducers(builder)  {
        builder
            // case for the time wating for response
            .addCase(fetchUserTasks.pending, (state,action)=>{
                state.status= 'loading';
            })
            // case for fullfiled promise
            .addCase(fetchUserTasks.fulfilled,(state,action)=>{
                state.tasks = action.payload.data.tasks;
                state.status='succeed'
            })
            // case for rejected promise
            .addCase(fetchUserTasks.rejected, (state, action)=>{
                state.error= action.payload.error.message;
                state.status= 'failed';
                checklogin(action.payload.error)
            })
    }
})

export const { setTasksStatus, setTasksFilter } = userTasksSlice.actions;

export const selectUserTasks = (state) => state.userTasks.tasks;
export const selectuserTasksFilter = (state)=> state.userTasks.filter;
export default userTasksSlice.reducer;