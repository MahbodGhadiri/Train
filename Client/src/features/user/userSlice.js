import { createSlice } from "@reduxjs/toolkit";
const initialState = {
    name: "",
    email: "",
    role:"",
    phone:"",
    isUserAuthenticated:false,
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
        }
    }
})

export const { setSignOutState, setUserLoginDetails, setUserAuthenticationStatus } = userSlice.actions;
export const selectUserName = (state) => state.user.name;
export const selectUserEmail = (state) => state.user.email;
export const selectUserRole = (state) => state.user.role;
export const selectUserPhone = (state) => state.user.phone;
export const selectUserAuthenticationStatus = (state)=> state.user.isUserAuthenticated;
export default userSlice.reducer;