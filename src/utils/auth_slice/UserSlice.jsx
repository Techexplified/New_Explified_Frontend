import { createSlice } from "@reduxjs/toolkit";

const storedUser = localStorage.getItem("explified");
const initialState = storedUser ? JSON.parse(storedUser) : null;

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    loginUser: (state, action) => {
      return action.payload;
    },
    removeUser: () => {
      return null;
    },
    clearUser: () => {
      localStorage.removeItem("explified"); // clear from localStorage
      return null;
    },
  },
});

export const { loginUser, removeUser, clearUser } = userSlice.actions;
export default userSlice.reducer;

