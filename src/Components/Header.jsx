import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaUserCircle } from "react-icons/fa";
import "../layout/Header.css";
import SearchBar from "./SearchBar";
import "../layout/signup.css";
import { supabase } from "../Supabase/client";

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
    <nav className="navbar">
      <div className="navbar-left">
        <Link to="/" className="navbar-brand">
          <span className="navbar-icon">🎮</span>
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
            >
              <FaUserCircle />
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
