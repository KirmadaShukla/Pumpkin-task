import { createSlice } from "@reduxjs/toolkit";

const savedUser = localStorage.getItem("user");
console.log("savedUser",savedUser)
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
        saveToken: (state, action) => {
            localStorage.setItem("token", action.payload);
            state.token = action.payload;
        },
        saveAllUsers: (state, action) => {
            state.users = action.payload;
        },
        saveUser: (state, action) => {
            localStorage.setItem("user", JSON.stringify(action.payload));
           state.isAuth = true;
           state.user = action.payload;
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
    saveToken,
    setLoading,
    saveAllUsers,
} = userSlice.actions;

export default userSlice.reducer;