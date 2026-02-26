import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  Navigate,
  Outlet,
} from "react-router-dom";
import { useContext } from "react";
import { SessionContext } from "../context/SessionContext";

import Navbar from "../components/Header";
import Sidebar from "../components/Sidebar";

import Home from "../pages/Home";
import Genre from "../pages/Genre";
import Game from "../pages/Game";
import Platform from "../pages/Platform";
import SearchResults from "../pages/SearchResults";
import SignUp from "../pages/SignUp";
import SignIn from "../pages/SignIn";
import Account from "../pages/Account";
import Favorites from "../pages/Favorites";

import Spinner from "../components/Spinner";
import "../layout/Layout.css";

function LayoutHome() {
  return (
    <div className="container">
      <Navbar />
      <div className="main">
        <Sidebar />
        <div className="games">
          <Outlet />
        </div>
      </div>
    </div>
  );
}

function LayoutBase() {
  return (
    <div className="container">
      <Navbar />
      <Outlet />
    </div>
  );
}

function ProtectedRoute() {
  const { user, loading } = useContext(SessionContext);

  if (loading) {
    return <Spinner />; 
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}

const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route element={<LayoutHome />}>
        <Route path="/" element={<Home />} />
      </Route>

      <Route element={<LayoutBase />}>
        <Route path="games/genre/:id" element={<Genre />} />
        <Route path="games/:id/:game" element={<Game />} />
        <Route path="games/platform/:platformID" element={<Platform />} />
        <Route path="search/:query" element={<SearchResults />} />

        <Route path="login" element={<SignIn />} />
        <Route path="register" element={<SignUp />} />

        <Route path="favorites" element={<Favorites />} />

        <Route element={<ProtectedRoute />}>
          <Route path="account" element={<Account />} />
        </Route>
      </Route>
    </>
  )
);

export default router;
