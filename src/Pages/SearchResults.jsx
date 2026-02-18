import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import GameCard from "../components/GameCard";
import Spinner from "../components/Spinner";
import BackButton from "../components/BackButton";

export default function SearchResults() {
  const { query } = useParams();

  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setResults([]);
    setLoading(true);

    const fetchResults = async () => {
      try {
        const response = await fetch(
          `https://api.rawg.io/api/games?key=c6d86a1b0cfc40fa8902c3705680c2ed&search=${query}`
        );

        const data = await response.json();
        setResults(data.results || []);
      } catch (error) {
        console.error("Errore ricerca:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [query]);

  if (loading) {
    return <Spinner />;
  }

  return (
    <div className="container">
      <BackButton />

      {results.length === 0 ? (
        <p style={{ textAlign: "center", marginTop: "40px" }}>
          Nessun risultato trovato.
        </p>
      ) : (
        <div className="games-grid">
          {results.map((game) => (
            <GameCard key={game.id} game={game} />
          ))}
        </div>
      )}
    </div>
  );
}