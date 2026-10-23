import { Breakpoint, useBreakpoint } from "../hooks/use-breakpoint";

/**Renders its children conditionally when the screen size is between the provided breakpoints.*/
export function BreakpointRenderer({
  children,
  min,
  max,
}: React.PropsWithChildren & { min: Breakpoint; max?: Breakpoint }) {
  const { breakpointBetween } = useBreakpoint();
  const shouldRender = breakpointBetween(min, max);
  return shouldRender ? children : null;
}
