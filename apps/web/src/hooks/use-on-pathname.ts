import { useLocation } from "react-router-dom";

/**Returns true if currently viewing a page at the provided target url. */
export function useOnUrl(target: string) {
  const location = useLocation();
  return location.pathname === target;
}
