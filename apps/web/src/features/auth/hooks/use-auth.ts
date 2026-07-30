import { useState } from 'react';
import { apiService } from '../../../utils/api-service';
import { useQuery } from '@tanstack/react-query';

type TSessionStatus = 'loading' | 'authenticated' | 'unauthenticated';

export function useAuth() {
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const {
    data: session,
    isPending,
    refetch: refetchSession,
  } = useQuery({
    queryKey: ['session'],
    queryFn: async () => {
      const res = await apiService.me();
      return res.ok ? await res.json() : null;
    },
  });

  const status: TSessionStatus = isPending
    ? 'loading'
    : session !== null
      ? 'authenticated'
      : 'unauthenticated';

  const toggleLogoutModal = (state: boolean) => setShowLogoutModal(state);

  const requestAuthorization = async (credentials: { email: string; username?: string }) => {
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

  return {
    authorize,
    requestAuthorization,
    logout,
    toggleLogoutModal,
    status,
    session,
    showLogoutModal,
  };
}
