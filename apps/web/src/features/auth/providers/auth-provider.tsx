import { useQuery } from '@tanstack/react-query';
import { setupContext } from '../../../utils/setup-context';
import { apiService } from '../../../utils/api-service';

type TSessionStatus = 'loading' | 'authorized' | 'unauthorized';
const [AuthContext, useAuthContext] = setupContext<{
  session: any;
  status: TSessionStatus;
  requestAuthorization: (credentials: { email: string; username?: string }) => Promise<Response>;
  authorize: (code: string) => Promise<Response>;
}>({
  name: 'AuthContext',
});

export function AuthProvider({ children }: React.PropsWithChildren) {
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
      ? 'authorized'
      : 'unauthorized';

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

  return (
    <AuthContext.Provider
      value={{
        session,
        requestAuthorization,
        authorize,
        status,
      }}>
      {children}
    </AuthContext.Provider>
  );
}

export { useAuthContext };
