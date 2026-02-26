import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../supabase/client";
import { useSession } from "../../context/SessionContext";
import styles from "./Account.module.css";
import {
  FaUserCircle,
  FaHeart,
  FaSignOutAlt,
  FaKey,
  FaTrash,
} from "react-icons/fa";
import Spinner from "../../components/Spinner";

export default function Account() {
  const { user } = useSession();
  const navigate = useNavigate();

  const [favoritesCount, setFavoritesCount] = useState(0);
  const [recentFavorites, setRecentFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);

      const { count } = await supabase
        .from("favorites")
        .select("*", { count: "exact", head: true })
        .eq("user_id", user.id);

      setFavoritesCount(count || 0);

      const { data } = await supabase
        .from("favorites")
        .select("*")
        .eq("user_id", user.id)
        .order("id", { ascending: false })
        .limit(3);

      setRecentFavorites(data || []);
      setLoading(false);
    };

    if (user) fetchData();
  }, [user]);

  useEffect(() => {
    if (!message) return;
    const timer = setTimeout(() => setMessage(""), 3000);
    return () => clearTimeout(timer);
  }, [message]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  const handlePasswordReset = async () => {
    setConfirmDelete(false);
    setMessage("Password reset email sent.");
    await supabase.auth.resetPasswordForEmail(user.email);
  };

  const handleDeleteAccount = async () => {
    if (isDeleting) return;

    setIsDeleting(true);
    setMessage("Deleting account...");

    await supabase.rpc("delete_user");
    await supabase.auth.signOut();
    navigate("/");
  };

  if (loading) return <Spinner />;

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <header className={styles.header}>
          <FaUserCircle
            className={styles.avatar}
            aria-hidden="true"
          />
          <h1>{user.user_metadata?.username || "User"}</h1>
          <p className={styles.email}>{user.email}</p>
          <span className={styles.badge}>
            Member since{" "}
            {new Date(user.created_at).toLocaleDateString("en-GB", {
              day: "2-digit",
              month: "long",
              year: "numeric",
            })}
          </span>
        </header>

        <section className={styles.stats}>
          <FaHeart
            className={styles.heartIcon}
            aria-hidden="true"
          />
          <span>{favoritesCount} Favorites</span>
        </section>

        <h2 className={styles.sectionTitle}>Your Collection</h2>

        {recentFavorites.length > 0 ? (
          <>
            {recentFavorites.map((fav) => (
              <div key={fav.id} className={styles.recentItem}>
                {fav.game_name}
              </div>
            ))}

            <div className={styles.viewAllWrapper}>
              <button
                className={styles.viewAllBtn}
                onClick={() => navigate("/favorites")}
                aria-label="View all favorite games"
              >
                See all your favorites →
              </button>
            </div>
          </>
        ) : (
          <div className={styles.emptyState}>
            <p>You haven’t saved any games yet.</p>
            <button
              className={styles.exploreBtn}
              onClick={() => navigate("/")}
              aria-label="Explore available games"
            >
              Explore Games
            </button>
          </div>
        )}

        <h2 className={styles.sectionTitle}>Account Settings</h2>

        <div className={styles.actions}>
          <button
            className={styles.secondaryBtn}
            onClick={handlePasswordReset}
            aria-label="Send password reset email"
          >
            <FaKey aria-hidden="true" /> Change Password
          </button>

          <button
            className={styles.neutralBtn}
            onClick={handleLogout}
            aria-label="Log out from account"
          >
            <FaSignOutAlt aria-hidden="true" /> Logout
          </button>

          {!confirmDelete ? (
            <button
              className={styles.dangerBtn}
              onClick={() => {
                setConfirmDelete(true);
                setMessage("");
              }}
              aria-label="Delete account"
            >
              <FaTrash aria-hidden="true" /> Delete Account
            </button>
          ) : (
            <div
              className={styles.confirmBox}
              role="alert"
            >
              <p>Are you sure you want to delete your account?</p>
              <div className={styles.confirmActions}>
                <button
                  className={styles.dangerBtn}
                  onClick={handleDeleteAccount}
                  disabled={isDeleting}
                  aria-label="Confirm account deletion"
                >
                  {isDeleting ? "Deleting..." : "Yes, delete"}
                </button>
                <button
                  className={styles.neutralBtn}
                  onClick={() => setConfirmDelete(false)}
                  disabled={isDeleting}
                  aria-label="Cancel account deletion"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>

        {message && (
          <div
            className={styles.successMessage}
            role="status"
          >
            {message}
          </div>
        )}
      </div>
    </div>
  );
}