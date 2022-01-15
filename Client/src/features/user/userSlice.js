import { createSlice } from "@reduxjs/toolkit";
const initialState = {
    name: "",
    email: "",
    role:"",
    phone:"",
    isUserAuthenticated:false,
    userList:[],
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
    }
})

export const { setSignOutState, setUserLoginDetails, setUserAuthenticationStatus , setUsersList} = userSlice.actions;
export const selectUserName = (state) => state.user.name;
export const selectUserEmail = (state) => state.user.email;
export const selectUserRole = (state) => state.user.role;
export const selectUserPhone = (state) => state.user.phone;
export const selectUserAuthenticationStatus = (state)=> state.user.isUserAuthenticated;
export const selectUserList = (state) => state.user.userList;
export default userSlice.reducer;