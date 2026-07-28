import { useEffect, useMemo } from 'react';

type UseEventHandlerProps<ET extends string, E extends Event> = {
  service?: any;
  type: ET;
  handler: (e: E) => void | Promise<void>;
};
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
