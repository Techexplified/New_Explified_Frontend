import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./auth_slice/UserSlice";
import toolReducer from "./tool_slice/ToolSlice";
import videoReducer from "./subtitler_slice/SubtitlerSlice";
export const store = configureStore({
  reducer: {
    user: userReducer,
    tool: toolReducer,
    video: videoReducer,
  },
  devTools: true, // Disable Redux DevTools
});
