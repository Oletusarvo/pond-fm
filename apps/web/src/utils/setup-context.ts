import { createContext, useContext } from 'react';

/**Creates a context and the hook for accessing its values. */
export function setupContext<T>({ name }: { name: string }) {
  const Ctx = createContext<T | null>(null);
  const hook = () => {
    const ctx = useContext(Ctx);
    if (!ctx) {
      throw new Error(`use${name} can only be called within the scope of a ${name}!`);
    }
    return ctx;
  };
  return [Ctx, hook] as const;
}
