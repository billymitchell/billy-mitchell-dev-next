"use client";
import { useEffect, useState } from "react";

// Parallax is disabled on small screens and for users who prefer reduced motion
const QUERY =
  "(max-width: 800px), (max-height: 600px), (prefers-reduced-motion: reduce)";

export default function useParallaxDisabled() {
  const [disabled, setDisabled] = useState(false);

  useEffect(() => {
    const media = window.matchMedia(QUERY);
    const update = () => setDisabled(media.matches);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);

  return disabled;
}
