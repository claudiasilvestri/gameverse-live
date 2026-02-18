import { createRoot } from "react-dom/client";
import "./Layout/global.css";
import "./Layout/header.css";
import "./Layout/BackButton.css";
import "./Layout/Spinner.css";
import Root from "./App.jsx";
import { AuthProvider } from "./context/AuthContext";

createRoot(document.getElementById("root")).render(
  <AuthProvider>
    <Root />
  </AuthProvider>
);
