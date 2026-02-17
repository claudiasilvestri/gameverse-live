import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { supabase } from "../Supabase/client";
import { useSession } from "../Context/SessionContext";
import GameImage from "./GameImage";
import "../Layout/GameCard.css";
import { toast } from "sonner";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import { FaWindows, FaPlaystation, FaXbox, FaApple } from "react-icons/fa";
import { SiNintendo } from "react-icons/si";

export default function GameCard({ game, onRemove }) {
  const navigate = useNavigate();
  const { user } = useSession();

  const [hidden, setHidden] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);
  const [loadingFav, setLoadingFav] = useState(false);

  const genres = game.genres?.map((genre) => genre.name).join(", ") || "";

  const getPlatformIcon = (platform) => {
    const name = platform.toLowerCase();

    if (name.includes("pc")) return <FaWindows />;
    if (name.includes("playstation")) return <FaPlaystation />;
    if (name.includes("xbox")) return <FaXbox />;
    if (name.includes("nintendo")) return <SiNintendo />;
    if (name.includes("mac")) return <FaApple />;

    return null;
  };

  useEffect(() => {
    if (!user) {
      setIsFavorite(false);
      return;
    }

    const checkFavorite = async () => {
      const { data } = await supabase
        .from("favorites")
        .select("id")
        .eq("user_id", user.id)
        .eq("game_id", game.id)
        .limit(1)
        .maybeSingle();

      setIsFavorite(!!data);
    };

    checkFavorite();
  }, [user, game.id]);

  const handleToggleFavorite = async (e) => {
    e.stopPropagation();

    if (!user) {
      toast.error("Please log in to use favorites ❤️", {
        id: "auth-required",
        duration: 2000,
      });
      return;
    }

    if (loadingFav) return;
    setLoadingFav(true);

    if (!isFavorite) {
      const { error } = await supabase.from("favorites").insert({
        user_id: user.id,
        game_id: game.id,
        game_name: game.name,
        game_image: game.background_image ?? null,
      });

      if (!error) {
        setIsFavorite(true);

        if (!onRemove) {
          toast.success("Added to favorites ❤️", {
            id: "fav-action",
            duration: 1600,
          });
        }
      } else {
        toast.error("Something went wrong", {
          id: "fav-error",
          duration: 2000,
        });
      }
    } else {
      const { error } = await supabase
        .from("favorites")
        .delete()
        .eq("user_id", user.id)
        .eq("game_id", game.id);

      if (!error) {
        setIsFavorite(false);

        if (onRemove) {
          onRemove();
        } else {
          toast.info("Removed from favorites", {
            id: "fav-action",
            duration: 1600,
          });
        }
      } else {
        toast.error("Something went wrong", {
          id: "fav-error",
          duration: 2000,
        });
      }
    }

    setLoadingFav(false);
  };

  return (
    <article
      className="game_card"
      onMouseEnter={() => setHidden(false)}
      onMouseLeave={() => setHidden(true)}
      onClick={() => navigate(`/games/${game.id}/${game.name}`)}
    >
      <button
        className="favorite_btn"
        onClick={handleToggleFavorite}
        disabled={loadingFav}
      >
        {isFavorite ? <FaHeart /> : <FaRegHeart />}
      </button>

      <div className="game_genres">{genres}</div>

      <div className="platform-icons">
        {game.parent_platforms?.map((p, index) => (
          <span
            key={index}
            className={`platform-icon ${p.platform.name.toLowerCase()}`}
          >
            {getPlatformIcon(p.platform.name)}
          </span>
        ))}
      </div>

      <GameImage image={game.background_image} />

      <h4 className="game_title">{game.name}</h4>

      {hidden ? (
        <small className="read_more">Read more</small>
      ) : (
        <div className="game_info">
          <p>
            <strong>Release Date:</strong> {game.released || "N/A"}
          </p>
          <p>
            <strong>Rating:</strong> {game.rating || "N/A"} / 5
          </p>
          <p>
            <strong>Reviews Count:</strong> {game.reviews_count || 0}
          </p>
        </div>
      )}
    </article>
  );
}

