import { useEffect } from "react";
import { useInView } from "react-intersection-observer";

type UseSentinelProps = {
  onVisible?: () => void;
  onInvisible?: () => void;
  threshold?: number;
};

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
