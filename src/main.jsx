import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { HeroUIProvider } from "@heroui/react";
import { Provider } from "react-redux";
import { store } from "./utils/store";
import { BrowserRouter } from "react-router-dom";
import { ExpliProvider } from "./context/ExpliContext.jsx";
import AuthProvider from "./context/AuthContext.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AuthProvider>
      <HeroUIProvider>
        <Provider store={store}>
          <ExpliProvider>
            <BrowserRouter>
              <App />
            </BrowserRouter>
          </ExpliProvider>
        </Provider>
      </HeroUIProvider>
    </AuthProvider>
  </StrictMode>,
);
