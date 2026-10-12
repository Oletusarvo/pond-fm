import { useEffect, useState } from "react";

type Breakpoint = "xs" | "sm" | "md" | "lg" | "xl" | "2xl";

const breakpoints: Record<Breakpoint, number> = {
  xs: 360,
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  "2xl": 1536,
};

function getBreakpoint(width: number): Breakpoint | null {
  const matches = Object.entries(breakpoints)
    .filter(([, minWidth]) => width >= minWidth)
    .map(([name]) => name as Breakpoint);

  return matches.at(-1) ?? null;
}

export function useBreakpoint(): Breakpoint | null {
  const [breakpoint, setBreakpoint] = useState<Breakpoint | null>(null);

  useEffect(() => {
    const updateBreakpoint = () => {
      setBreakpoint(getBreakpoint(window.innerWidth));
    };

    updateBreakpoint();

    window.addEventListener("resize", updateBreakpoint);
    return () => window.removeEventListener("resize", updateBreakpoint);
  }, []);

  return breakpoint;
}
