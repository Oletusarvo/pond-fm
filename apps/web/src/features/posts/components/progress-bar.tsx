import { useClassName } from "../../../hooks/use-class-name";

export function ProgressBar({ progress, status = 'uploading' }: { progress: number; status: 'uploading' | 'processing' }) {
  const className = useClassName(
    'h-1',
    status === 'processing' ? 'bg-orange-500' : 'bg-primary'
  )
  return <div className="flex flex-col w-full items-start">
    <div className="w-full rounded-md overflow-hidden bg-slate-200">
      <div style={{
        width: `${progress}%`
      }} className={className} />
    </div>
    {status === 'processing' ? <span className="text-sm italic text-slate-500">Processing...</span> : null}
  </div>
}