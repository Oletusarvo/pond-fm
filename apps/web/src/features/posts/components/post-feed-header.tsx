import { ReactNode } from "react";
import { PassProps } from "../../../components/pass-props";

type PostFeedHeaderProps = React.PropsWithChildren & {
  title: string;
  description: string;
  icon?: ReactNode;
};

/**Renders the header for post feeds. */
export function PostFeedHeader({ children, title, description, icon }: PostFeedHeaderProps) {
  return (
    <div className='w-full py-3 md:py-4' id='track-feed-header'>
      <div className='mb-3 flex flex-col gap-2' id='track-feed-heading-area'>
        <div className='flex items-center gap-2'>
          {icon ? (
            <div className='flex h-7 w-7 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-700'>
              <PassProps size='0.9rem' color='currentColor'>
                {icon}
              </PassProps>
            </div>
          ) : null}
          <h2 className='text-sm font-black uppercase tracking-[0.22em] text-emerald-700'>
            {title}
          </h2>
        </div>

        {description ? <p className='text-sm leading-6 text-slate-600'>{description}</p> : null}
      </div>

      <div className='rounded-3xl border border-slate-200 bg-white/80 p-3 shadow-[0_8px_25px_rgba(15,23,42,0.04)]'>
        {children}
      </div>
    </div>
  );
}
