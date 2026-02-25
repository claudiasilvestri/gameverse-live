import { useNavigate } from "react-router-dom";
import "../layout/BackButton.css";

export default function BackButton() {
  const navigate = useNavigate();

  return (
    <button
      type="button"
      className="backButtonFixed"
      onClick={() => navigate(-1)}
      aria-label="Go back to previous page"
    >
      <span aria-hidden="true">←</span> Back
    </button>
  );
}