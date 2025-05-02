import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { HeroUIProvider } from "@heroui/react";
import { Provider } from "react-redux";
import { store } from "./utils/store";

createRoot(document.getElementById("root")).render(
  <GoogleOAuthProvider
    clientId={
      "901696391731-b51g3b2v9734hp7n6i6o3qgplqvt3te9.apps.googleusercontent.com"
    }
  >
    <StrictMode>
      <HeroUIProvider>
        <Provider store={store}>
          <App />{" "}
        </Provider>
      </HeroUIProvider>
    </StrictMode>
  </GoogleOAuthProvider>
);
