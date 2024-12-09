import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import "react-day-picker/style.css";
import { GoogleOAuthProvider } from "@react-oauth/google";
import App from "./App.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <GoogleOAuthProvider clientId="37612735881-de7e36l8iop0eoddrivt2342i6o2kqq5.apps.googleusercontent.com">
      <App />
    </GoogleOAuthProvider>
  </StrictMode>
);
