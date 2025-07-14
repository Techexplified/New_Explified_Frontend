// import { configureStore } from "@reduxjs/toolkit";
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
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ["video/addVideo"],
        ignoredPaths: ["video"],
      },
    }),
  devTools: true, // Disable Redux DevTools
});
