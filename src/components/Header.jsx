import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaUserCircle } from "react-icons/fa";
import "../layout/Header.css";
import SearchBar from "./SearchBar";
import "../layout/signup.css";
import { supabase } from "../supabase/Client";

export default function Navbar() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const getInfo = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      setUser(user);
    };

    getInfo();

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user || null);
      }
    );

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  return (
    <nav className="navbar" role="navigation" aria-label="Main navigation">
      <div className="navbar-left">
        <Link to="/" className="navbar-brand" aria-label="Go to homepage">
          <span className="navbar-icon" aria-hidden="true">🎮</span>
          <span className="navbar-title">GameVerse</span>
        </Link>
      </div>

      <SearchBar />

      <div className="navbar-right">
        {!user ? (
          <>
            <Link to="/register" className="auth-btn">
              Sign Up
            </Link>
            <Link to="/login" className="auth-btn">
              Login
            </Link>
          </>
        ) : (
          <>
            <Link to="/favorites" className="auth-btn">
              ❤️ Favorites
            </Link>

            <button
              className="account-btn"
              onClick={() => navigate("/account")}
              aria-label="Open account page"
            >
              <FaUserCircle aria-hidden="true" />
              <span className="account-name">
                {user?.user_metadata?.username
                  ? user.user_metadata.username.charAt(0).toUpperCase() +
                    user.user_metadata.username.slice(1)
                  : "Player"}
              </span>
            </button>
          </>
        )}
      </div>
    </nav>
  );
}
