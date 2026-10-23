import { createProvider } from "../utils/create-provider";
import { PassProps } from "../components/pass-props";
import { stopPropagation } from "../utils/stop-propagation";
import { useToggle } from "../hooks/use-toggle";

export const [
  /**Provides functionality for toggling things on and off. */
  ToggleProvider,
  /**Accesses the methods of a ToggleContext. */
  useToggleContext,
] = createProvider({
  contextName: "ToggleContext",
  hook: useToggle,
  extend: (hook) => {
    return {
      Trigger: function ({ children }: React.PropsWithChildren) {
        const { toggle } = hook();
        return <PassProps onClick={stopPropagation(() => toggle())}>{children}</PassProps>;
      },

      Target: function ({ children }: React.PropsWithChildren) {
        const { value } = hook();
        return value ? children : null;
      },
    };
  },
});
