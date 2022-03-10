import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { setUserId  } from "../../components/SessionStorage";
import axios from "axios";
import { checklogin } from "../../components/CheckLogin";
const initialState = {
    id: "",
    name: "",
    email: "",
    role:"",
    phone:"",
    ability:null,
    avatarURL:"",
    status: "idle", //idle status calls the "get" api
    error: null,
}

export const fetchProfile= createAsyncThunk('profile/fetchProfile', async() =>{
    // returning a promise to createAsyncThunk (do not use "await")
    return axios.get(`/user/profile`)
})

const profileSlice = createSlice({
    name: "profile",
    initialState,
    reducers: {
        setSignOutState: state => {
            state.name = null;
            state.email = null;
            state.role = null;
            state.phone = null;
            state.isUserAuthenticated=false;
        },
        setProfileStatus: (state,action) =>{
            state.status = action.payload.status;
        },
    },
    extraReducers(builder) {
        builder
            .addCase(fetchProfile.pending,(state)=>{
                state.status="loading";
            })
            .addCase(fetchProfile.fulfilled,(state,action)=>{
                state.status="succeed";
                state.id = action.payload.data.id;
                state.name = action.payload.data.name;
                state.email = action.payload.data.email.address;
                state.role = action.payload.data.role;
                state.phone = action.payload.data.phone.number;
                state.ability = action.payload.data.ability;
                state.avatarURL= action.payload.data.avatarURL;
                setUserId(action.payload.data._id);
            })
            .addCase(fetchProfile.rejected,(state,action)=>{
                state.status="failed";
                state.error=action.payload?.error; //TODO check if error is working
                checklogin(action.payload?.error)
            })
    }
    
})

export const { setSignOutState, setProfileStatus } = profileSlice.actions;

export const selectUserName = (state) => state.profile.name;
export const selectUserEmail = (state) => state.profile.email;
export const selectUserRole = (state) => state.profile.role;
export const selectUserPhone = (state) => state.profile.phone;
export const selectUserAbility = (state) => state.profile.ability;
export const selectUserId = (state) => state.profile.id;
export const selectUserAvatarURL = (state) => state.profile.avatarURL;
export default profileSlice.reducer;