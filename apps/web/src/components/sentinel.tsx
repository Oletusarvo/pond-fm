import { useEffect } from "react";
import { useInView } from "react-intersection-observer";

type SentinelProps = {
  onVisible?: () => void;
  onInvisible?: () => void;
};
export function Sentinel({ onVisible, onInvisible }: SentinelProps) {
  const { inView, ref } = useInView({
    threshold: 0.5,
  });
  useEffect(() => {
    if (inView) {
      onVisible?.();
    } else {
      onInvisible?.();
    }
  }, [inView]);
  return <div ref={ref} className='h-1 shrink-0' />;
}
