import { useEffect, useRef } from "react";
import { useMainLayoutContext } from "../layouts/main-layout";

export function useScrollToTop() {
  const { refElement } = useMainLayoutContext();
  useEffect(() => {
    if (!refElement) return;

    if (refElement.scrollTop > 0) {
      refElement.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }
  });
  return refElement;
}
