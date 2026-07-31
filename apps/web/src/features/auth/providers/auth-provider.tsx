import { createProvider } from '../../../utils/create-provider';
import { LogoutModal } from '../components/logout-modal';
import { useAuth } from '../hooks/use-auth';

const [AuthProvider, useAuthContext] = createProvider({
  hook: useAuth,
  contextName: 'AuthContext',
  childComponent: () => {
    const { showLogoutModal } = useAuthContext();
    return showLogoutModal ? <LogoutModal /> : null;
  },
});

export { AuthProvider, useAuthContext };
