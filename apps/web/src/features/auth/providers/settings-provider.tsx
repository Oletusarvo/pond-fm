import { useState } from 'react';
import { createProvider } from '../../../utils/create-provider';
import { ProfileSettingsModal } from '../components/settings-modal';

export const [SettingsProvider, useSettingsContext] = createProvider({
  contextName: 'SettingsContext',
  childComponent: () => {
    const { showSettingsModal } = useSettingsContext();
    return showSettingsModal ? <ProfileSettingsModal /> : null;
  },
  hook: () => {
    const [showSettingsModal, setShowSettingModal] = useState(false);
    const toggleSettingsModal = (state: boolean) => {
      setShowSettingModal(state);
    }
    return {
      showSettingsModal,
      toggleSettingsModal,
    };
  },
});
