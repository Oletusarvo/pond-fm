import React, { ReactNode } from "react";
import { setupContext } from "./setup-context";

type CreateProviderProps<
  THookReturn,
  THookProps = void,
  TExtendProps extends Record<string, React.FC<any>> | void = void,
> = {
  /**A function containing the logic of the provider. */
  hook: (props: THookProps & React.PropsWithChildren) => THookReturn & {
    ChildComponent?: React.FC<any>;
  } & React.PropsWithChildren;
  /**A component that should be included among the children of the context provider. */
  childComponent?: React.FC<THookReturn>;
  /**A method used to modify the children before rendering them. */
  processChildren?: ({
    children,
    ...props
  }: React.PropsWithChildren & THookProps) => ReactNode;
  /**A function returning an object used to extend the context provider. */
  extend?: (hook: () => THookReturn) => TExtendProps;
  /**The name of the context. Used in error messages to identify it. */
  contextName: string;
};

/**Creates a context provider and a hook to access it. */
export function createProvider<
  THookReturn,
  THookProps,
  TExtendProps extends Record<string, React.FC<any>>,
>({
  hook,
  contextName,
  extend,
  childComponent: ChildComponent,
}: CreateProviderProps<THookReturn, THookProps, TExtendProps>) {
  const [Context, useContext] = setupContext<THookReturn>({
    name: contextName,
  });
  const Provider = ({
    children,
    ...props
  }: React.PropsWithChildren & THookProps) => {
    const { children: wetChildren, ...value } = hook({
      ...(props as THookProps),
      children,
    });

    return (
      <Context.Provider value={value as THookReturn}>
        {wetChildren || children}
        {ChildComponent ? <ChildComponent {...(value as any)} /> : null}
      </Context.Provider>
    );
  };
  const extendProps = extend?.(useContext);
  if (extendProps) {
    Object.assign(Provider, extendProps);
  }
  return [
    Provider as React.FC<THookProps & React.PropsWithChildren> & TExtendProps,
    useContext,
  ] as const;
}
