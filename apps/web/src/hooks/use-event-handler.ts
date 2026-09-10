import { useEffect, useMemo } from "react";

type UseEventHandlerProps<ET extends string, E extends Event> = {
  /**The target the event handler should be assigned to. */
  service?: any;
  /**The type of event the handler should be executed on. */
  type: ET;
  /**The handler for the event. */
  handler: (e: E) => void | Promise<void>;
};

/**Provides functionality for listening to events; abstracting away the cleanup of those events on unmounts. */
export function useEventHandler<ET extends string, E extends Event>({
  service,
  handler,
  type,
}: UseEventHandlerProps<ET, E>) {
  useEffect(() => {
    service?.addEventListener(type, handler);
    return () => {
      service?.removeEventListener(type, handler);
    };
  }, [service, handler, type]);
}
