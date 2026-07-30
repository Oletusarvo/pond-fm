import { Context, ReactNode } from 'react';
import { setupContext } from './setup-context';

type CreateProviderProps<THookReturn, THookProps = void> = {
  hook: (props: THookProps) => THookReturn & { hookChildren?: ReactNode };
  contextName: string;
};
export function createProvider<THookReturn, THookProps = {}>({
  hook,
  contextName,
}: CreateProviderProps<THookReturn, THookProps>) {
  const [Context, useContext] = setupContext<THookReturn>({ name: contextName });
  function Provider({ children, ...props }: React.PropsWithChildren & THookProps) {
    const { hookChildren, ...value } = hook({ ...(props as THookProps) });
    return (
      <Context.Provider value={value as THookReturn}>
        {children}
        {hookChildren}
      </Context.Provider>
    );
  }
  return [Provider, useContext] as const;
}
