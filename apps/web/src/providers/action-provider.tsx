import { useActions } from "../features/events/hooks/use-events";
import { createProvider } from "../utils/create-provider";

const [
  ActionProvider,
  useActionContext] = createProvider({
    contextName: 'ActionProvider',
    hook: () => useActions()
  });

export {
  /**@deprecated */
  ActionProvider,
  /**@deprecated */
  useActionContext
}