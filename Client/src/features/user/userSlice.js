import { createSlice } from "@reduxjs/toolkit";
const initialState = {
    name: "",
    email: "",
    role:"",
    phone:"",
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
        setSignOutState: state => {
            state.name = null;
            state.email = null;
            state.role = null;
            state.phone = null;

        }
    }
})

export const { setSignOutState, setUserLoginDetails } = userSlice.actions;
export const selectUserName = (state) => state.user.name;
export const selectUserEmail = (state) => state.user.email;
export const selectUserRole = (state) => state.user.role;
export const selectUserPhone = (state) => state.user.phone;
export default userSlice.reducer;