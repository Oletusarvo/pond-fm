import { useState } from 'react';
import { createProvider } from '../../../utils/create-provider';
import { SettingsModal } from '../components/settings-modal';

export const [SettingsProvider, useSettingsContext] = createProvider({
  contextName: 'SettingsContext',
  childComponent: () => {
    const { showSettingsModal } = useSettingsContext();
    return showSettingsModal ? <SettingsModal /> : null;
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
