import { useEffect, useRef } from "react";

export function useScrollToTop() {
  const ref = useRef(null);
  useEffect(() => {
    if (!ref.current) return;
    if (ref.current.scrollY > 0) {
      console.log("Scrolling to top...");
      ref.current.scrollTo({
        top: 0,
        behavior: "instant",
      });
    }
  });
  return ref;
}
