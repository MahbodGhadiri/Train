import { createSlice } from "@reduxjs/toolkit";
const initialState = {
    id: "",
    name: "",
    email: "",
    role:"",
    phone:"",
    ability:null,
    isUserAuthenticated:false,
    userList:[],
    customTasks:null,
    avatarURL:"",
   
}
const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        setUserLoginDetails: (state, action) => {
            state.name = action.payload.name;
            state.email = action.payload.email;
            state.role = action.payload.role;
            state.phone = action.payload.phone;
            state.ability = action.payload.ability;
            state.id = action.payload.id;
            state.avatarURL= action.payload.avatarURL;
        },
        setUserAuthenticationStatus: (state, action)=>{
            state.isUserAuthenticated = action.payload;
            console.log(action.payload)
            console.log(state.isUserAuthenticated)
        },
        setSignOutState: state => {
            state.name = null;
            state.email = null;
            state.role = null;
            state.phone = null;
            state.isUserAuthenticated=false;
        },
        setUsersList: (state, action) => {
            state.userList = action.payload.userList;
          
        },
        setCustomTasks: (state, action) => {
            state.customTasks = action.payload.customTasks;


        },
    }
})

export const { setSignOutState, setUserLoginDetails, setUserAuthenticationStatus , setUsersList , setCustomTasks} = userSlice.actions;
export const selectUserName = (state) => state.user.name;
export const selectUserEmail = (state) => state.user.email;
export const selectUserRole = (state) => state.user.role;
export const selectUserPhone = (state) => state.user.phone;
export const selectCustomTasks = (state) => state.user.customTasks;
export const selectUserAuthenticationStatus = (state)=> state.user.isUserAuthenticated;
export const selectUserList = (state) => state.user.userList;
export const selectUserAbility = (state) => state.user.ability;
export const selectUserId = (state) => state.user.id;
export const selectUserAvatarURL = (state) => state.user.avatarURL;
export default userSlice.reducer;