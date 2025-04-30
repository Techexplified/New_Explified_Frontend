import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { GoogleOAuthProvider } from "@react-oauth/google";

createRoot(document.getElementById("root")).render(
  <GoogleOAuthProvider clientId={"901696391731-b51g3b2v9734hp7n6i6o3qgplqvt3te9.apps.googleusercontent.com"}>
    <StrictMode>
      <App />
    </StrictMode>
  </GoogleOAuthProvider>
);
