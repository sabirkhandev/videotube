import { createSlice } from "@reduxjs/toolkit";

// Initial state: application start
const initialState = {
    status: false,  // User logged in or not (true/false)
    userData: null  // Logged in user details
};

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        //On Login 
        login: (state, action) => {
            state.status = true;
            state.userData = action.payload; // action.payload has user object
        },
        // On Logout
        logout: (state) => {
            state.status = false;
            state.userData = null;
        }
    }
});

export const { login, logout } = authSlice.actions;
export default authSlice.reducer;