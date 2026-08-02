import { useEffect, useState } from 'react';
import { createProvider } from '../../../utils/create-provider';
import { useAuthContext } from './auth-provider';
import { SetUsernameModal } from '../components/set-username-modal';

export const [OnboardingProvider, useOnboardingContext] = createProvider({
  contextName: 'OnboardingContext',
  childComponent: () => {
    const { showOnboardingModal } = useOnboardingContext();
    return showOnboardingModal ? <SetUsernameModal /> : null;
  },
  hook: () => {
    const authService = useAuthContext();
    console.log(authService.status, authService.session);
    const showOnboardingModal =
      authService.status === 'authenticated' && authService.session.user.username === null;
    console.log(showOnboardingModal);
    return {
      showOnboardingModal,
    };
  },
});
