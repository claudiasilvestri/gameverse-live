import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../layout/SearchBar.css";

export default function SearchBar() {
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  function handleSubmit(e) {
    e.preventDefault();
    if (!query.trim()) return;
    navigate(`/search/${query.trim()}`);
    setQuery("");
  }

  return (
    <form className="search-container" onSubmit={handleSubmit}>
      <input
        type="text"
        className="search-bar"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search for a game..."
      />
      <button type="submit" className="search-btn">
        Search
      </button>
    </form>
  );
}
