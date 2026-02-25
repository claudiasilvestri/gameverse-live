import { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import styles from "./game.module.css";
import GameImage from "../../components/GameImage";
import BackButton from "../../components/BackButton";
import Spinner from "../../components/Spinner";
import noTrailer from "../../Assets/No-Trailer.jpg";

const API_KEY = "c6d86a1b0cfc40fa8902c3705680c2ed";
const YT_KEY = import.meta.env.VITE_YOUTUBE_KEY;

function Carousel({ images, gameName }) {
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
        aria-label={`Previous screenshot of ${gameName}`}
      >
        ‹
      </button>

      <div
        className={styles.carouselContainer}
        style={{ transform: `translateX(-${scrollIndex * 100}%)` }}
      >
        {images.map((image, index) => (
          <div key={index} className={styles.carouselImageWrapper}>
            <GameImage
              image={image}
              alt={`${gameName} screenshot ${index + 1}`}
            />
          </div>
        ))}
      </div>

      <button
        onClick={handleScrollRight}
        className={`${styles.scrollButton} ${styles.rightButton}`}
        aria-label={`Next screenshot of ${gameName}`}
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

  const trailerButtonRef = useRef(null);

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
            setLoading(false);
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

  useEffect(() => {
    if (showTrailer) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
      trailerButtonRef.current?.focus();
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [showTrailer]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        setShowTrailer(false);
      }
    };

    if (showTrailer) {
      document.addEventListener("keydown", handleKeyDown);
    }

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [showTrailer]);

  if (loading) return <Spinner />;

  const formattedDescription = game?.description?.replace(
    /<p>([A-Z0-9\s&–\-:]+)<\/p>/g,
    "<h3>$1</h3>"
  );

  return (
    <div className={styles.centeredContainer}>
      {game && (
        <div className={styles.gameCard}>
          <BackButton />

          <h1 className={styles.gameTitle}>{game.name}</h1>

          <GameImage
            image={game.background_image}
            className={styles.gameCover}
            alt={`${game.name} cover image`}
          />

          {screenshots.length > 0 && (
            <Carousel
              images={screenshots.map((s) => s.image).filter(Boolean)}
              gameName={game.name}
            />
          )}

          {trailerUrl || youtubeId ? (
            <button
              ref={trailerButtonRef}
              className={styles.trailerButton}
              aria-label={`Watch trailer for ${game.name}`}
              aria-haspopup="dialog"
              aria-expanded={showTrailer}
              onClick={() => setShowTrailer(true)}
            >
              Watch Trailer
            </button>
          ) : (
            <div className={styles.noTrailerBox}>
              <img
                src={noTrailer}
                alt={`No trailer available for ${game.name}`}
                className={styles.noTrailerImage}
              />
            </div>
          )}

          <div className={styles.contentBlock}>
            <h2 className={styles.sectionTitle}>Overview</h2>

            <div
              className={styles.description}
              dangerouslySetInnerHTML={{ __html: formattedDescription }}
            />
          </div>

          <div className={styles.metaSection}>
            <div className={styles.metaItem}>
              <span className={styles.metaLabel}>Rating</span>
              <span className={styles.metaValue}>{game.rating}</span>
            </div>

            <div className={styles.metaItem}>
              <span className={styles.metaLabel}>Released</span>
              <span className={styles.metaValue}>{game.released}</span>
            </div>
          </div>

          {showTrailer && (
            <div
              className={styles.modalOverlay}
              role="dialog"
              aria-modal="true"
              aria-labelledby="trailer-title"
              onClick={() => setShowTrailer(false)}
            >
              <div
                className={styles.modalContent}
                onClick={(e) => e.stopPropagation()}
              >
                <h2 id="trailer-title" className="sr-only">
                  {game.name} Trailer
                </h2>

                <div className={styles.videoWrapper}>
                  {trailerUrl ? (
                    <video controls autoPlay className={styles.trailerVideo}>
                      <source src={trailerUrl} type="video/mp4" />
                    </video>
                  ) : (
                    <iframe
                      className={styles.trailerVideo}
                      src={`https://www.youtube.com/embed/${youtubeId}`}
                      title={`${game.name} Trailer`}
                      allowFullScreen
                    />
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}