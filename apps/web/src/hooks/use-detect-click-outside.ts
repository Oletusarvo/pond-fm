import { useEffect, useRef } from "react";

type UseDetectClickOutsideProps = {
  onClickOutside: () => void;
};

/**Provides functionality for detecting clicks outside elements. */
export function useDetectClickOutside({ onClickOutside }: UseDetectClickOutsideProps) {
  const ref = useRef<HTMLElement>(null);
  useEffect(() => {
    if (!ref.current) return;
    const handler = (e) => {
      const element = ref.current;

      if (!element) return;

      if (!element.contains(e.target as Node)) {
        onClickOutside();
      }
    };
    document.addEventListener("pointerdown", handler);
    return () => {
      document.removeEventListener("pointerdown", handler);
    };
  }, [onClickOutside, ref.current]);
  return {
    ref,
  };
}
