import { useState, useEffect, useRef } from "react";
import styles from "./Home.module.css";
import GameCard from "../../Components/GameCard";
import Spinner from "../../Components/Spinner";

const BASE_URL =
  "https://api.rawg.io/api/games?key=c6d86a1b0cfc40fa8902c3705680c2ed&dates=2024-01-01,2024-12-31&page_size=20";

export default function Home() {
  const [games, setGames] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const observerRef = useRef(null);
  const loadMoreRef = useRef(null);

  const fetchData = async (pageNum) => {
    setLoading(true);
    try {
      const response = await fetch(`${BASE_URL}&page=${pageNum}`);
      const json = await response.json();

      if (pageNum === 1) {
        setGames(json.results);
      } else {
        setGames((prev) => [...prev, ...json.results]);
      }
    } catch (error) {
      console.error("Errore nel caricamento:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(page);
  }, [page]);

  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setPage((prevPage) => prevPage + 1);
        }
      },
      { threshold: 1.0 }
    );

    if (loadMoreRef.current) {
      observerRef.current.observe(loadMoreRef.current);
    }

    return () => {
      observerRef.current?.disconnect();
    };
  }, []);

  return (
    <div className={`${styles.main} ${styles.container}`}>
      <div className={styles.content}>
        <h1 className={styles.title}>New and trending</h1>

        <div className="games-grid">
          {games.map((game) => (
            <GameCard key={game.id} game={game} />
          ))}
        </div>

        <div ref={loadMoreRef} style={{ height: "20px" }} />

        {loading && <Spinner />}
      </div>
    </div>
  );
}
