import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./auth_slice/UserSlice";
import toolReducer from "./tool_slice/ToolSlice";
export const store = configureStore({
  reducer: {
    user: userReducer,
    tool: toolReducer,
  },
  devTools: true, // Disable Redux DevTools
});
