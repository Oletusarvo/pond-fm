import { ReactNode } from "react";
import { PassProps } from "../../../components/pass-props";

type PostFeedHeaderProps = React.PropsWithChildren & {
  title: string;
  description: string;
  icon?: ReactNode;
};

/**Renders the header for post feeds. */
export function PostFeedHeader({
  children,
  title,
  description,
  icon,
}: PostFeedHeaderProps) {
  return (
    <div className='py-2 w-full h-pad'>
      <div className='flex flex-col pb-2'>
        <div className='flex gap-1 items-center'>
          {icon ? (
            <PassProps size='1rem' color='var(--color-primary)'>
              {icon}
            </PassProps>
          ) : null}
          <h2 className='font-semibold text-primary md:text-base xs:text-sm'>
            {title}
          </h2>
        </div>

        <p className='text-slate-500 text-sm'>{description}</p>
      </div>
      {children}
    </div>
  );
}
