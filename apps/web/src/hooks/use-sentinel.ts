import { useEffect } from "react";
import { useInView } from "react-intersection-observer";

type UseSentinelProps = {
  onVisible?: () => void;
  onInvisible?: () => void;
  threshold?: number;
};

/**Uses the usInView-hook internally. Fires onVisible when the returned ref becomes visible, and onInvisible when it becomes invisible.*/
export function useSentinel({ onVisible, onInvisible, threshold }: UseSentinelProps) {
  const { inView, ref } = useInView({
    threshold,
  });
  useEffect(() => {
    if (inView) {
      onVisible?.();
    } else {
      onInvisible?.();
    }
  }, [inView]);
  return { ref };
}
