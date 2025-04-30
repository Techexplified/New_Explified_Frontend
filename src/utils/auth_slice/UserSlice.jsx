import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
    name: "user",
    initialState: null,
    reducers: {
        loginUser: (state, action) => {
            return action.payload;
        },
        removeUser: () => {
            return null;
        },
    }
});

export const { loginUser, removeUser } = userSlice.actions;
export default userSlice.reducer;