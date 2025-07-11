import { createSlice } from "@reduxjs/toolkit";

const videoSlice = createSlice({
  name: "video",
  initialState: null,
  reducers: {
    addVideo: (state, action) => {
      return action.payload;
    },
    removeVideo: () => {
      return null;
    },
  },
});

export const { addVideo, removeVideo } = videoSlice.actions;
export default videoSlice.reducer;
