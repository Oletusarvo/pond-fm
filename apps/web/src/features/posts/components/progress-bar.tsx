import { useClassName } from "../../../hooks/use-class-name";

export function ProgressBar({ progress, status = 'uploading' }: { progress: number; status: 'uploading' | 'processing' }) {
  const className = useClassName(
    'h-full transition-all duration-500',
    status === 'processing' ? 'bg-green-300' : 'bg-primary'
  )
  return <div className="flex flex-col w-full items-start">
    <div className="w-full rounded-md overflow-hidden bg-slate-200 h-1" >
      <div style={{
        width: `${progress}%`
      }} className={className} />
    </div>
  </div>
}