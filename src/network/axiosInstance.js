import axios from "axios";

// Set the backend URL - use environment variable or fallback to the correct backend URL
const backendURL =
  import.meta.env.VITE_APP_URL || "https://api-pf6diz22ka-uc.a.run.app/";

console.log("Backend URL:", backendURL);

const axiosInstance = axios.create({
  baseURL: backendURL,
  // Add CORS headers
  headers: {
    "Content-Type": "application/json",
  },
  // Add withCredentials if needed
  withCredentials: false,
});

export default axiosInstance;
