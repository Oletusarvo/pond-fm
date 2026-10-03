export function HorizontalScrollable({ children }: React.PropsWithChildren) {
  return <div className='flex items-center gap-1 max-w-full shrink-0 no-scrollbar'>{children}</div>;
}
