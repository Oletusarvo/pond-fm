/**Renders a the container for post feed screens. */
export function PostFeedScreenContainer({ children }: React.PropsWithChildren) {
  return <div className='flex flex-col w-full max-h-full h-full'>{children}</div>;
}
