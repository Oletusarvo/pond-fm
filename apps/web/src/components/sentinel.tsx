import { useEffect } from 'react';
import { useInView } from 'react-intersection-observer';

export function Sentinel({ onVisible }) {
  const { inView, ref } = useInView({
    threshold: 0.5,
  });
  useEffect(() => {
    if (inView) {
      onVisible();
    }
  }, [inView]);
  return <div ref={ref} className="h-1 shrink-0" />;
}
