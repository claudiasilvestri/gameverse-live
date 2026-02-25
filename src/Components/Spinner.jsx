import React from "react";
import "../layout/Spinner.css";

const Spinner = () => {
  return (
    <div
      className="spinner"
      role="status"
      aria-live="polite"
      aria-label="Loading content"
    >
      <div className="loader" aria-hidden="true"></div>
    </div>
  );
};

export default Spinner;