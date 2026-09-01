import { useState } from 'react';
import { apiService } from '../../../utils/api/api-service';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { LogoutModal } from '../components/logout-modal';
import { TSession, TSubscriptionRestricted, TUser, TUserRestricted } from '@pondfm/app-shared';

type TSessionStatus = 'loading' | 'authenticated' | 'unauthenticated';

export function useAuth() {
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const queryClient = useQueryClient();
  const {
    data: session,
    isPending,
    refetch: refetchSession,
  } = useQuery<TSession>({
    queryKey: ['session'],
    queryFn: async () => {
      const res = await apiService.me();
      return res.ok ? await res.json() : null;
    },
    staleTime: Infinity,
  });

  const status: TSessionStatus = isPending
    ? 'loading'
    : session !== null
      ? 'authenticated'
      : 'unauthenticated';

  const toggleLogoutModal = (state: boolean) => setShowLogoutModal(state);

  const requestAuthorization = async (credentials: Pick<TUser, 'email'>) => {
    return await apiService.requestAuthorization(credentials);
  };

  const authorize = async (code: string) => {
    const res = await apiService.authorize(code);
    if (res.ok) {
      await refetchSession();
    }
    return res;
  };

  const logout = async () => {
    const res = await apiService.logout();
    if (res.ok) {
      refetchSession();
    }
    return res;
  };

  const refreshSession = async (newSession?: Omit<Partial<TSession>, 'user'> & {
    user?: Partial<TUserRestricted> & {
      subscription?: Partial<TSubscriptionRestricted>;
    }
  }) => {
    let payload;
    queryClient.setQueryData(['session'], (oldSession: TSession) => {
      if (!oldSession) return oldSession;
      const newData = {
        ...oldSession,
        user: {
          ...oldSession.user,
          ...newSession?.user,
          subscription: {
            ...oldSession.user.subscription,
            ...newSession?.user?.subscription,
          }
        }
      };

      return payload = newData;
    });
    return await apiService.refreshSession(payload);
  };

  return {
    authorize,
    requestAuthorization,
    logout,
    toggleLogoutModal,
    refreshSession,
    status,
    session,
    showLogoutModal,
  };
}
