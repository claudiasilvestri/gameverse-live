import { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import styles from "./Platform.module.css";
import GameCard from "../../components/GameCard";
import Spinner from "../../components/Spinner";
import BackButton from "../../components/BackButton";

const BASE_URL =
  "https://api.rawg.io/api/games?key=c6d86a1b0cfc40fa8902c3705680c2ed";
const PLATFORMS_URL =
  "https://api.rawg.io/api/platforms?key=c6d86a1b0cfc40fa8902c3705680c2ed";

export default function Platform() {
  const { platformID } = useParams();

  const [platformName, setPlatformName] = useState("");
  const [games, setGames] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [nextPageData, setNextPageData] = useState(null);

  const observerRef = useRef(null);
  const loadMoreRef = useRef(null);

  useEffect(() => {
    const fetchPlatformName = async () => {
      try {
        const response = await fetch(PLATFORMS_URL);
        const data = await response.json();
        const found = data.results.find(
          (p) => p.id.toString() === platformID
        );
        setPlatformName(found ? found.name : "Unknown Platform");
      } catch {
        setPlatformName("Unknown Platform");
      }
    };
    fetchPlatformName();
  }, [platformID]);

  useEffect(() => {
    setGames([]);
    setPage(1);
    setNextPageData(null);
  }, [platformID]);

  useEffect(() => {
    const fetchGames = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          `${BASE_URL}&platforms=${platformID}&page=${page}`
        );
        const json = await response.json();

        if (page === 1) setGames(json.results);
        else setGames((prev) => [...prev, ...json.results]);

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

    fetchGames();
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
      observerRef.current?.disconnect();
    };
  }, [nextPageData]);

  return (
    <main className={`${styles.main} ${styles.container}`}>
      <div className={styles.content}>
        <BackButton />

        <h1 className={styles.title}>{platformName}</h1>

        {loading && page === 1 && (
          <div role="status" aria-live="polite">
            <Spinner />
          </div>
        )}

        <section
          className="games-grid"
          aria-label={`Games available on ${platformName}`}
        >
          {games.map((game) => (
            <GameCard key={game.id} game={game} />
          ))}
        </section>

        <div
          ref={loadMoreRef}
          style={{ height: "20px" }}
          aria-hidden="true"
        />
      </div>
    </main>
  );
}

