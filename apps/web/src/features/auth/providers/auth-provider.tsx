import { useAuth } from '../hooks/use-auth';
import { createProvider } from '../../../utils/create-provider';

const [AuthProvider, useAuthContext] = createProvider({
  hook: useAuth,
  contextName: 'AuthContext',
});

export { AuthProvider, useAuthContext };
