type PostFeedHeaderProps = React.PropsWithChildren & {
  title: string;
  description: string;
};

/**Renders the header for post feeds. */
export function PostFeedHeader({ children, title, description }: PostFeedHeaderProps) {
  return (
    <div className='py-2 w-full h-pad'>
      <div className='flex flex-col pb-2'>
        <h2 className='font-semibold text-primary text-sm'>{title}</h2>
        <p className='text-slate-500 text-xs'>{description}</p>
      </div>
      {children}
    </div>
  );
}
