import { createSlice } from "@reduxjs/toolkit";

const toolSlice = createSlice({
  name: "tool",
  initialState: null,
  reducers: {
    addTool: (state, action) => {
      return action.payload;
    },
    removeTool: () => {
      return null;
    },
  },
});

export const { addTool, removeTool } = toolSlice.actions;
export default toolSlice.reducer;
