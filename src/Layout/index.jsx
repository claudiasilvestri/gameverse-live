import { useState } from "react";
import { Outlet } from "react-router-dom";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import "../layout/Layout.css";

export default function Index() {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="container">
      <Header />

      <button onClick={() => setSidebarOpen(!sidebarOpen)}>
        Toggle Sidebar
      </button>

      <div className={`main ${sidebarOpen ? "sidebar-open" : ""}`}>
        <div style={{ width: 250, background: "red", color: "white" }}>
  TEST LAYOUT
</div>

        <div className="games">
          <Outlet />
        </div>
      </div>
    </div>
  );
}