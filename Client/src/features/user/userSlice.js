import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
const initialState = {
    userList:[],
    status: "idle", //idle status calls the "get" api
    error: null,
}

export const fetchUsers= createAsyncThunk('users/fetchUsers', async() =>{
    // returning a promise to createAsyncThunk (do not use "await")
    return axios.get(`/admin/users`)
})

const usersSlice = createSlice({
    name: "users",
    initialState,
    reducers: {
        setUsersStatus: (state,action) =>{
            state.status = action.payload.status;
        }
    },
        extraReducers(builder) {
            builder
                .addCase(fetchUsers.pending,(state)=>{
                    state.status="loading";
                })
                .addCase(fetchUsers.fulfilled,(state,action)=>{
                    state.status="succeed";
                    state.userList = action.payload.data;
                })
                .addCase(fetchUsers.rejected,(state,action)=>{
                    state.status="failed";
                    state.error=action.payload.error;
                })
        }
    }
)

export const { setUsersStatus } = usersSlice.actions;
export const selectUserList = (state) => state.users.userList;


export default usersSlice.reducer;