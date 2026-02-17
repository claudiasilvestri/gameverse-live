import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../Supabase/client";
import { useSession } from "../../Context/SessionContext";
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

    const timer = setTimeout(() => {
      setMessage("");
    }, 3000);

    return () => clearTimeout(timer);
  }, [message]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  const handlePasswordReset = async () => {
    await supabase.auth.resetPasswordForEmail(user.email);
    setMessage("Password reset email sent.");
  };

  const handleDeleteAccount = async () => {
    if (!confirmDelete) {
      setConfirmDelete(true);
      return;
    }

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

        {message && (
          <div className={styles.successMessage}>
            {message}
          </div>
        )}

        <div className={styles.header}>
          <FaUserCircle className={styles.avatar} />
          <h2>{user.user_metadata?.username || "User"}</h2>
          <p className={styles.email}>{user.email}</p>
          <span className={styles.badge}>
            Member since{" "}
            {new Date(user.created_at).toLocaleDateString("en-GB", {
              day: "2-digit",
              month: "long",
              year: "numeric",
            })}
          </span>
        </div>

        <div className={styles.stats}>
          <FaHeart className={styles.heartIcon} />
          <span>{favoritesCount} Favorites</span>
        </div>

        <h3 className={styles.sectionTitle}>Your Collection</h3>

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
            >
              Explore Games
            </button>
          </div>
        )}

        <h3 className={styles.sectionTitle}>Account Settings</h3>

        <div className={styles.actions}>
          <button
            className={styles.secondaryBtn}
            onClick={handlePasswordReset}
          >
            <FaKey /> Change Password
          </button>

          <button
            className={styles.neutralBtn}
            onClick={handleLogout}
          >
            <FaSignOutAlt /> Logout
          </button>

          {!confirmDelete ? (
            <button
              className={styles.dangerBtn}
              onClick={handleDeleteAccount}
            >
              <FaTrash /> Delete Account
            </button>
          ) : (
            <div className={styles.confirmBox}>
              <p>Are you sure you want to delete your account?</p>
              <div className={styles.confirmActions}>
                <button
                  className={styles.dangerBtn}
                  onClick={handleDeleteAccount}
                  disabled={isDeleting}
                >
                  {isDeleting ? "Deleting..." : "Yes, delete"}
                </button>
                <button
                  className={styles.neutralBtn}
                  onClick={() => setConfirmDelete(false)}
                  disabled={isDeleting}
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
