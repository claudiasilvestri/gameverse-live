import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  Navigate,
  Outlet,
} from "react-router-dom";
import { useContext } from "react";
import { SessionContext } from "../Context/SessionContext";

import Navbar from "../Components/Header";
import Sidebar from "../Components/Sidebar";

import Home from "../Pages/Home";
import Genre from "../Pages/Genre";
import Game from "../Pages/Game";
import Platform from "../Pages/Platform";
import SearchResults from "../Pages/SearchResults";
import SignUp from "../Pages/SignUp";
import SignIn from "../Pages/SignIn";
import Account from "../Pages/Account";
import Favorites from "../Pages/Favorites";

import Spinner from "../components/Spinner";
import "../Layout/Layout.css";

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
