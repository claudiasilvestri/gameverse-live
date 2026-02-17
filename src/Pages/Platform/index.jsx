import { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import styles from "./Platform.module.css";
import GameCard from "../../components/GameCard";
import Spinner from "../../components/Spinner";
import BackButton from "../../components/BackButton";

const BASE_URL =
  "https://api.rawg.io/api/games?key=c6d86a1b0cfc40fa8902c3705680c2ed";

export default function Platform() {
  const { platformID } = useParams();

  const [games, setGames] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [nextPageData, setNextPageData] = useState(null);

  const observerRef = useRef(null);
  const loadMoreRef = useRef(null);

  useEffect(() => {
    setGames([]);
    setPage(1);
    setNextPageData(null);
  }, [platformID]);

  useEffect(() => {
    const fetchPlatforms = async () => {
      setLoading(true);

      try {
        const response = await fetch(
          `${BASE_URL}&platforms=${platformID}&page=${page}`
        );
        const json = await response.json();

        if (page === 1) {
          setGames(json.results);
        } else {
          setGames((prev) => [...prev, ...json.results]);
        }

        if (json.next) {
          const nextResponse = await fetch(
            `${BASE_URL}&platforms=${platformID}&page=${page + 1}`
          );
          const nextJson = await nextResponse.json();
          setNextPageData(nextJson.results);
        } else {
          setNextPageData(null);
        }
      } catch (error) {
        console.error("Errore nel caricamento:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPlatforms();
  }, [platformID, page]);

  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && nextPageData) {
          setGames((prev) => [...prev, ...nextPageData]);
          setNextPageData(null);
          setPage((prevPage) => prevPage + 1);
        }
      },
      { threshold: 1.0 }
    );

    if (loadMoreRef.current) {
      observerRef.current.observe(loadMoreRef.current);
    }

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [nextPageData]);

  return (
    <div className={`${styles.main} ${styles.container}`}>
      <BackButton />

      {loading && page === 1 && <Spinner />}

      <div className={styles.games_wrapper}>
        {games.map((game) => (
          <GameCard key={game.id} game={game} />
        ))}
      </div>

      <div ref={loadMoreRef} style={{ height: "20px" }} />
    </div>
  );
}