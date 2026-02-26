import { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabase/client";
import { SessionContext } from "../context/SessionContext";
import GameCard from "../components/GameCard";
import Spinner from "../components/Spinner";
import styles from "./Home/Home.module.css";
import "../layout/BackButton.css";

const BASE_URL = "https://api.rawg.io/api/games/";
const API_KEY = "c6d86a1b0cfc40fa8902c3705680c2ed";

export default function Favorites() {
  const { user } = useContext(SessionContext);
  const navigate = useNavigate();

  const [favorites, setFavorites] = useState([]);
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user) return;

    const fetchFavorites = async () => {
      setLoading(true);

      const { data } = await supabase
        .from("favorites")
        .select("game_id")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      setFavorites(data || []);
      setLoading(false);
    };

    fetchFavorites();
  }, [user]);

  useEffect(() => {
    if (!user) return;

    if (favorites.length === 0) {
      setGames([]);
      return;
    }

    const fetchGames = async () => {
      setLoading(true);

      try {
        const requests = favorites.map((fav) =>
          fetch(`${BASE_URL}${fav.game_id}?key=${API_KEY}`).then((res) =>
            res.json()
          )
        );

        const results = await Promise.all(requests);
        setGames(results.filter((game) => game?.id));
      } catch (error) {
        console.error("Error loading favorites:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchGames();
  }, [favorites, user]);

  return (
    <main className={`${styles.main} ${styles.container}`}>
      <div className={styles.content}>
        <h1 className={styles.title}>Favorites</h1>

        {!user ? (
          <p className={styles.empty}>
            Please login to view your favorites 
          </p>
        ) : (
          <>
            <button
              className="backButtonFixed"
              onClick={() => navigate(-1)}
              aria-label="Go back to previous page"
            >
              ← Back
            </button>

            {loading ? (
              <div role="status" aria-live="polite">
                <Spinner />
              </div>
            ) : games.length === 0 ? (
              <p className={styles.empty}>
                You haven’t added any favorites yet ❤️
              </p>
            ) : (
              <section
                className="games-grid"
                aria-label="List of favorite games"
              >
                {games.map((game) => (
                  <GameCard
                    key={game.id}
                    game={game}
                    onRemove={() =>
                      setGames((prev) =>
                        prev.filter((g) => g.id !== game.id)
                      )
                    }
                  />
                ))}
              </section>
            )}
          </>
        )}
      </div>
    </main>
  );
}