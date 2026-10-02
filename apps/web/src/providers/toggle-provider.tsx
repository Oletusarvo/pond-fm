import { useCallback, useState } from "react";
import { createProvider } from "../utils/create-provider";
import { PassProps } from "../components/pass-props";
import { setupContext } from "../utils/setup-context";
import { useStopPropagation } from "../hooks/use-stop-propagation";
import { stopPropagation } from "../utils/stop-propagation";

type ToggleProviderProps = React.PropsWithChildren & {
  initialState?: boolean;
};

export const [
  /**Provides functionality for toggling things on and off. */
  ToggleProvider,
  /**Accesses the methods of a ToggleContext. */
  useToggleContext,
] = createProvider({
  contextName: "ToggleContext",
  hook: ({ initialState }: ToggleProviderProps) => {
    const [isOn, setIsOn] = useState(initialState || false);
    const toggleState = useCallback((state: boolean) => setIsOn(state), [setIsOn]);
    return {
      isOn,
      toggleState,
    };
  },
  extend: (hook) => {
    return {
      Trigger: function ({ children }: React.PropsWithChildren) {
        const { isOn, toggleState } = hook();
        return (
          <PassProps onClick={stopPropagation(() => toggleState(!isOn))}>{children}</PassProps>
        );
      },

      Target: function ({ children }: React.PropsWithChildren) {
        const { isOn } = hook();
        return isOn ? children : null;
      },
    };
  },
});
