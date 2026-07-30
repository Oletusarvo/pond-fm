import { useState } from 'react';
import { useNotifications } from '../hooks/use-notifications';
import { NotificationsModal } from '../components/notifications-modal';
import { useAuthContext } from '../../auth/providers/auth-provider';
import { createProvider } from '../../../utils/create-provider';

export const [NotificationsProvider, useNotificationsContext] = createProvider({
  contextName: 'NotificationsProvider',
  hook: () => {
    const authService = useAuthContext();

    const {
      data: notifications,
      isPending,
      nextPageTriggerRef,
    } = useNotifications(authService.session);
    const [showNotificationsModal, setShowNotificationsModal] = useState(false);
    const toggleShowNotificationsModal = (state: boolean) => {
      setShowNotificationsModal(state);
    };
    const hookChildren = showNotificationsModal ? <NotificationsModal /> : null;
    const hasUnseen = notifications?.some(n => n.seen_at === null) || false;

    return {
      notifications,
      hasUnseen,
      isPending,
      nextPageTriggerRef,
      toggleShowNotificationsModal,
      hookChildren,
    };
  },
});
