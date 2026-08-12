import { useRef, useState } from 'react';
import { NotificationsModal } from '../components/notifications-modal';
import { createProvider } from '../../../utils/create-provider';
import { useFeedContext } from '../../../providers/feed-provider';
import { useAuthContext } from '../../auth/providers/auth-provider';
import { useQuery } from '@tanstack/react-query';
import { apiService } from '../../../utils/api-service';
import { useInfiniteFeed } from '../../../hooks/use-infinite-feed';

export const [NotificationsProvider, useNotificationsContext] = createProvider({
  contextName: 'NotificationsProvider',
  childComponent: () => {
    const { showNotificationsModal } = useNotificationsContext();
    return showNotificationsModal ? <NotificationsModal /> : null;
  },
  hook: () => {
    const [showNotificationsModal, setShowNotificationsModal] = useState(false);
    const toggleShowNotificationsModal = (state: boolean) => {
      setShowNotificationsModal(state);
    };

    return {
      toggleShowNotificationsModal,
      showNotificationsModal,
    };
  },
});
