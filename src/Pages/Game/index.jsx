import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import styles from "./game.module.css";
import GameImage from "../../components/GameImage";
import BackButton from "../../components/BackButton";
import Spinner from "../../components/Spinner";
import noTrailer from "../../Assets/No-Trailer.jpg";

const API_KEY = "c6d86a1b0cfc40fa8902c3705680c2ed";
const YT_KEY = import.meta.env.VITE_YOUTUBE_KEY;

function Carousel({ images }) {
  const [scrollIndex, setScrollIndex] = useState(0);

  const handleScrollLeft = () => {
    setScrollIndex(scrollIndex === 0 ? images.length - 1 : scrollIndex - 1);
  };

  const handleScrollRight = () => {
    setScrollIndex(scrollIndex === images.length - 1 ? 0 : scrollIndex + 1);
  };

  return (
    <div className={styles.carousel}>
      <button
        onClick={handleScrollLeft}
        className={`${styles.scrollButton} ${styles.leftButton}`}
      >
        ‹
      </button>

      <div
        className={styles.carouselContainer}
        style={{ transform: `translateX(-${scrollIndex * 100}%)` }}
      >
        {images.map((image, index) => (
          <div key={index} className={styles.carouselImageWrapper}>
            <GameImage image={image} className={styles.carouselShot} />
          </div>
        ))}
      </div>

      <button
        onClick={handleScrollRight}
        className={`${styles.scrollButton} ${styles.rightButton}`}
      >
        ›
      </button>
    </div>
  );
}

export default function Game() {
  const { id } = useParams();

  const [game, setGame] = useState(null);
  const [screenshots, setScreenshots] = useState([]);
  const [trailerUrl, setTrailerUrl] = useState(null);
  const [youtubeId, setYoutubeId] = useState(null);
  const [showTrailer, setShowTrailer] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setTrailerUrl(null);
      setYoutubeId(null);

      try {
        const gameRes = await fetch(
          `https://api.rawg.io/api/games/${id}?key=${API_KEY}`
        );
        const gameData = await gameRes.json();
        setGame(gameData);

        const screenshotsRes = await fetch(
          `https://api.rawg.io/api/games/${id}/screenshots?key=${API_KEY}`
        );
        const screenshotsData = await screenshotsRes.json();
        setScreenshots(screenshotsData.results || []);

        const trailerRes = await fetch(
          `https://api.rawg.io/api/games/${id}/movies?key=${API_KEY}`
        );
        const trailerData = await trailerRes.json();

        if (trailerData.results?.length > 0) {
          const movie = trailerData.results[0];
          const video =
            movie.data?.max || movie.data?.["480"] || movie.data?.["360"];

          if (video) {
            setTrailerUrl(video);
            return;
          }
        }

        const ytRes = await fetch(
          `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(
            gameData.name + " videogame official trailer"
          )}&key=${YT_KEY}&maxResults=5&type=video`
        );

        const ytData = await ytRes.json();

        if (ytData.items?.length > 0) {
          setYoutubeId(ytData.items[0].id.videoId);
        }
      } catch (error) {
        console.error("Errore nel fetch:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  if (loading) {
    return <Spinner />;
  }

  return (
    <div className={styles.centeredContainer}>
      {game && (
        <div className={styles.gameCard}>
          <BackButton />

          <h2 className={styles.gameTitle}>{game.name}</h2>

          <GameImage
            image={game.background_image}
            className={styles.gameCover}
          />

          {screenshots.length > 0 && (
            <Carousel
              images={screenshots.map((s) => s.image).filter(Boolean)}
            />
          )}

          {trailerUrl || youtubeId ? (
            <button
              className={styles.trailerButton}
              onClick={() => setShowTrailer(true)}
            >
              Guarda Trailer
            </button>
          ) : (
            <div className={styles.noTrailerBox}>
              <img
                src={noTrailer}
                alt="No trailer available"
                className={styles.noTrailerImage}
              />
            </div>
          )}

          {showTrailer && (
            <div
              className={styles.modalOverlay}
              onClick={() => setShowTrailer(false)}
            >
              <div
                className={styles.modalContent}
                onClick={(e) => e.stopPropagation()}
              >
                <div className={styles.videoWrapper}>
                  {trailerUrl ? (
                    <video controls autoPlay className={styles.trailerVideo}>
                      <source src={trailerUrl} type="video/mp4" />
                    </video>
                  ) : (
                    <iframe
                      className={styles.trailerVideo}
                      src={`https://www.youtube.com/embed/${youtubeId}`}
                      title="YouTube Trailer"
                      allowFullScreen
                    />
                  )}
                </div>
              </div>
            </div>
          )}

          <p>{game.description_raw}</p>
          <p className={styles.bold}>Rating: {game.rating}</p>
          <p className={styles.bold}>Released: {game.released}</p>
        </div>
      )}
    </div>
  );
}
