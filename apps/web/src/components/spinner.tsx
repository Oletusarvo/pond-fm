import { useClassName } from "../hooks/use-class-name";

export function Spinner({ size = '1rem' }: { size?: string }) {
  return (
    <div className='animate-spin border-2 border-white border-t-primary rounded-full' style={{
      width: size,
      height: size
    }} />
  );
}
