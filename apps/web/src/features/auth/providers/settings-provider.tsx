import { useState } from 'react';
import { createProvider } from '../../../utils/create-provider';

const [SettingsProvider, useSettingsContext] = createProvider({
  contextName: 'SettingsContext',

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

export {
  /**@deprecated */
  SettingsProvider,
  /**@deprecated */
  useSettingsContext
}
