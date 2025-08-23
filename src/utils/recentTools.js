// utils/recentTools.js
export const addRecentTool = (tool) => {
  let recent = JSON.parse(localStorage.getItem("recentTools")) || [];

  // Remove if already exists
  recent = recent.filter((t) => t.title !== tool.title);

  // Add latest
  recent.push(tool);

  // Limit to 6 tools
  if (recent.length > 6) {
    recent = recent.slice(recent.length - 6);
  }

  localStorage.setItem("recentTools", JSON.stringify(recent));
};

export const getRecentTools = () => {
  return JSON.parse(localStorage.getItem("recentTools")) || [];
};

export const removeRecentTool = (title) => {
  let recent = JSON.parse(localStorage.getItem("recentTools")) || [];
  recent = recent.filter((t) => t.title !== title);
  localStorage.setItem("recentTools", JSON.stringify(recent));
};