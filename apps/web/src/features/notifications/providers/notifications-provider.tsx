import { useRef, useState } from 'react';
import { NotificationsModal } from '../components/notifications-modal';
import { createProvider } from '../../../utils/create-provider';
import { useFeedContext } from '../../../providers/feed-provider';
import { useAuthContext } from '../../auth/providers/auth-provider';

export const [NotificationsProvider, useNotificationsContext] = createProvider({
  contextName: 'NotificationsProvider',
  childComponent: () => {
    const { showNotificationsModal } = useNotificationsContext();
    return showNotificationsModal ? <NotificationsModal /> : null;
  },
  hook: () => {
    const authService = useAuthContext();
    const [showNotificationsModal, setShowNotificationsModal] = useState(false);
    const hasUnseen = useRef<boolean>(authService.session?.user.unseen_notification_count > 0 || false);
    const toggleShowNotificationsModal = (state: boolean) => {
      setShowNotificationsModal(state);
    };
    const updateHasUnseen = (state: boolean) => hasUnseen.current = state;

    return {
      hasUnseen: hasUnseen.current,
      toggleShowNotificationsModal,
      updateHasUnseen,
      showNotificationsModal,
    };
  },
});
