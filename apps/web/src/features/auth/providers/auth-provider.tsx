import { useQuery } from '@tanstack/react-query';
import { setupContext } from '../../../utils/setup-context';
import { apiService } from '../../../utils/api-service';
import { LogoutModal } from '../components/logout-modal';
import { useState } from 'react';
import { useAuth } from '../hooks/use-auth';

const [AuthContext, useAuthContext] = setupContext<ReturnType<typeof useAuth>>({
  name: 'AuthContext',
});

/**Provides logic for authentication. @deprecated */
export function AuthProvider({ children }: React.PropsWithChildren) {
  const authService = useAuth();
  return (
    <AuthContext.Provider value={authService}>
      {children}
      {authService.showLogoutModal ? <LogoutModal /> : null}
    </AuthContext.Provider>
  );
}

export { useAuthContext };
