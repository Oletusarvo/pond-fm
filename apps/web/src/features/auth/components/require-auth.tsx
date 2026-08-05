import React from "react";
import { useAuthContext } from "../providers/auth-provider";
import { Spinner } from "../../../components/spinner";
import { Navigate } from "react-router-dom";

export function RequireAuth({ children }: React.PropsWithChildren) {
  const authService = useAuthContext();
  if (authService.status === 'loading') {
    return <Spinner />
  }
  else if (authService.status === 'unauthenticated') {
    return <Navigate to="/login" />
  }

  return children;
}