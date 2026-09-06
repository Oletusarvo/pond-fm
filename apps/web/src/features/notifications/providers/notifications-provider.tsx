import { useState } from "react";
import { NotificationsModal } from "../components/notifications-modal";
import { createProvider } from "../../../utils/create-provider";

export const [NotificationsProvider, useNotificationsContext] = createProvider({
  contextName: "NotificationsProvider",
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
