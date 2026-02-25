import { useState, useEffect } from "react";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";

import NoCover from "../assets/No-Cover.jpg";

export default function GameImage({ image, alt = "", className = "" }) {
  const [imgSrc, setImgSrc] = useState(image || NoCover);

  useEffect(() => {
    setImgSrc(image || NoCover);
  }, [image]);

  return (
    <LazyLoadImage
      alt={alt}
      effect="blur"
      src={imgSrc}
      onError={() => setImgSrc(NoCover)}
      className={`game-image ${className}`}
    />
  );
}