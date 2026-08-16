import { Context, ReactNode } from 'react';
import { setupContext } from './setup-context';

type CreateProviderProps<THookReturn, THookProps = void> = {
  hook: (props: THookProps) => THookReturn & { ChildComponent?: React.FC<any> };
  childComponent?: React.FC<THookReturn>;
  extend?: (Ctx: React.FC<THookProps>, hook: (props: THookProps) => THookReturn) => void,
  contextName: string;
};
export function createProvider<THookReturn, THookProps>({
  hook,
  contextName,
  extend,
  childComponent: ChildComponent,
}: CreateProviderProps<THookReturn, THookProps>) {
  const [Context, useContext] = setupContext<THookReturn>({ name: contextName });
  function Provider({ children, ...props }: React.PropsWithChildren & THookProps) {
    const value = hook({ ...(props as THookProps) });

    return (
      <Context.Provider value={value as THookReturn}>
        {children}
        {ChildComponent ? <ChildComponent {...value} /> : null}
      </Context.Provider>
    );
  }
  extend?.(Provider, hook);
  return [Provider, useContext] as const;
}
