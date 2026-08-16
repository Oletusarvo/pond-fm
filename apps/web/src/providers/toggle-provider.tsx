import { useState } from "react";
import { createProvider } from "../utils/create-provider";
import { PassProps } from "../components/pass-props";
import { setupContext } from "../utils/setup-context";

type ToggleProviderProps = React.PropsWithChildren & {
  initialState?: boolean;
}

const [ToggleContext, useToggleContext] = setupContext<{
  isOn: boolean;
  toggleState: (state: boolean) => void;
}>({ name: 'ToggleContext' });

function ToggleProvider({ children, initialState }: ToggleProviderProps) {
  const [isOn, setIsOn] = useState(initialState || false);
  const toggleState = (state: boolean) => setIsOn(state);
  return (
    <ToggleContext.Provider value={{ isOn, toggleState }}>{children}</ToggleContext.Provider>
  );
}

ToggleProvider.Trigger = function ({ children }: React.PropsWithChildren) {
  const { isOn, toggleState } = useToggleContext();
  return <PassProps onClick={() => toggleState(!isOn)}>{children}</PassProps>
}

ToggleProvider.Target = function ({ children }: React.PropsWithChildren) {
  const { isOn } = useToggleContext();
  return isOn ? children : null;
}

export { ToggleProvider, useToggleContext };