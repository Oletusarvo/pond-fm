import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { LogoutModal } from "../components/logout-modal";
import { TSession, TSubscriptionRestricted, TUser, TUserRestricted } from "@pondfm/app-shared";
import { api } from "../../../utils/api/api";

type TSessionStatus = "loading" | "authenticated" | "unauthenticated";

export function useAuth() {
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const queryClient = useQueryClient();
  const {
    data: session,
    isPending,
    refetch: refetchSession,
  } = useQuery<TSession>({
    queryKey: ["session"],
    queryFn: async () => {
      const res = await api.auth.me();
      return res.success ? res.data : null;
    },
    staleTime: Infinity,
  });

  const status: TSessionStatus = isPending
    ? "loading"
    : session !== null
      ? "authenticated"
      : "unauthenticated";

  const toggleLogoutModal = (state: boolean) => setShowLogoutModal(state);

  const requestAuthorization = async (credentials: Pick<TUser, "email">) => {
    return await api.auth.requestAuthorization(credentials);
  };

  const signup = async (credentials: Pick<TUser, "email" | "username">) => {
    const res = await api.auth.signup(credentials);
    if (res.success) {
      await refreshSession();
    }
    return res;
  };

  const authorize = async (code: string, state: string) => {
    const res = await api.auth.audius.getToken(code, state);
    if (res.success) {
      await refetchSession();
    }
    return res;
  };

  const logout = async () => {
    const res = await api.auth.logout();
    if (res.success) {
      refetchSession();
    }
    return res;
  };

  const refreshSession = async (
    newSession?: Omit<Partial<TSession>, "user"> & {
      user?: Omit<Partial<TUserRestricted>, "subscription"> & {
        subscription?: Partial<TSubscriptionRestricted>;
      };
    },
  ) => {
    let payload;
    queryClient.setQueryData(["session"], (oldSession: TSession) => {
      if (!oldSession) return oldSession;
      const newData = {
        ...oldSession,
        user: {
          ...oldSession.user,
          ...newSession?.user,
          subscription: {
            ...oldSession.user.subscription,
            ...newSession?.user?.subscription,
          },
        },
      };

      return (payload = newData);
    });
    return await api.auth.refreshSession(payload);
  };

  return {
    authorize,
    signup,
    requestAuthorization,
    logout,
    toggleLogoutModal,
    refreshSession,
    status,
    session,
    showLogoutModal,
  };
}
