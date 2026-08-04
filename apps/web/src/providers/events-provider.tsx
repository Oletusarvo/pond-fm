import { useEvents } from "../features/events/hooks/use-events";
import { createProvider } from "../utils/create-provider";

export const [EventsProvider, useEventsContext] = createProvider({
  contextName: 'EventsContrxt',
  hook: () => useEvents()
});