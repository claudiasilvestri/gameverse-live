import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "../layout/Sidebar.css";

export default function Sidebar() {
  const [genres, setGenres] = useState([]);
  const [platforms, setPlatforms] = useState([]);
  const [open, setOpen] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const g = await fetch("https://api.rawg.io/api/genres?key=c6d86a1b0cfc40fa8902c3705680c2ed");
      const p = await fetch("https://api.rawg.io/api/platforms?key=c6d86a1b0cfc40fa8902c3705680c2ed");
      setGenres((await g.json()).results);
      setPlatforms((await p.json()).results);
    };
    fetchData();
  }, []);

  return (
    <aside className="sidebar">
      <div className="details-wrapper">
        <div className="section">
          <div className="summary" onClick={() => setOpen(open === "genres" ? null : "genres")}>
            Genres
          </div>
          {open === "genres" && (
            <ul>
              {genres.map(g => (
                <li key={g.id}>
                  <Link to={`/games/genre/${g.id}`}>{g.name}</Link>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="section">
          <div className="summary" onClick={() => setOpen(open === "platforms" ? null : "platforms")}>
            Platforms
          </div>
          {open === "platforms" && (
            <ul>
              {platforms.map(p => (
                <li key={p.id}>
                  <Link to={`/games/platform/${p.id}`}>{p.name}</Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </aside>
  );
}