import { createSlice } from "@reduxjs/toolkit";

const savedUser = localStorage.getItem("user");
const initialState = {
    user: savedUser ? JSON.parse(savedUser) : null,
    isAuth: savedUser ? true : false,
    loading: false,
    users: [],
};

export const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        setLoading: (state, action) => {
            state.loading = action.payload;
        },
        saveAllUsers: (state, action) => {
            state.users = action.payload;
        },
        saveUser: (state, action) => {
            localStorage.setItem("user", JSON.stringify(action.payload));
           state.isAuth = true;
        },
        removeUser: (state) => {
            localStorage.removeItem("user");
            state.user = null;
            state.isAuth = false;
        },
       
    },
});

export const {
    saveUser,
    removeUser,
    setLoading,
    saveAllUsers,
} = userSlice.actions;

export default userSlice.reducer;