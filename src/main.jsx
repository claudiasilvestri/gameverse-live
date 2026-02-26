import { createRoot } from "react-dom/client";
import "./layout/Global.css";
import "./layout/Header.css";
import "./layout/BackButton.css";
import "./layout/Spinner.css";
import Root from "./App.jsx";

createRoot(document.getElementById("root")).render(
  <Root />
);