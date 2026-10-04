import { useSentinel } from "../hooks/use-sentinel";

type SentinelProps = {
  onVisible?: () => void;
  onInvisible?: () => void;
};
export function Sentinel({ onVisible, onInvisible }: SentinelProps) {
  const { ref } = useSentinel({ onVisible, onInvisible, threshold: 0.5 });
  return <div ref={ref} className='shrink-0 h-1' />;
}
