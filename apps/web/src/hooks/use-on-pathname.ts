import { useLocation } from "react-router-dom";

export function useOnPathname(target: string) {
  const location = useLocation();
  return location.pathname === target;
}
