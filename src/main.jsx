import { createRoot } from "react-dom/client";
import "./Layout/Global.css";
import "./Layout/Header.css";
import "./Layout/BackButton.css";
import "./Layout/Spinner.css";
import Root from "./App.jsx";

createRoot(document.getElementById("root")).render(
  <Root />
);