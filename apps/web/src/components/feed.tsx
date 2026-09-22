import { ReactNode, useEffect } from "react";
import { useInfiniteFeed } from "../hooks/use-infinite-feed";
import { Separator } from "./separator";
import React from "react";
import { LoadingFiller } from "./loading-filler";
import { useFeedContext } from "../providers/feed-provider";
import { Sentinel } from "./sentinel";
import { useAuthContext } from "../features/auth/providers/auth-provider";
import { Ad, AdBanner } from "../features/ads/components/ad-container";
import { AdProvider } from "../features/ads/providers/ad-provider";

const adElement = import.meta.env.PROD ? <Ad /> : null;

type FeedScreenProps = {
  keyExtractor?: (item: any) => string;
  renderComponent: (item: any) => ReactNode;
  /**The content shown if the feed has no items. */
  onEmptyComponent?: () => ReactNode;
};
export function Feed({
  renderComponent: RenderComponent,
  keyExtractor,
  onEmptyComponent: OnEmptyComponent,
}: FeedScreenProps) {
  const { data, isPending, isError, error, fetchNextPage } = useFeedContext();
  const { session } = useAuthContext();

  if (isPending) {
    return <LoadingFiller />;
  } else if (isError) {
    console.log(error);

    return (
      <div className='flex w-full flex-col justify-center items-center flex-1 h-full'>
        <span className='text-red-900'>Failed to load feed!</span>
      </div>
    );
  }

  if (!data.length) {
    return (
      <div className='flex w-full flex-1 h-full justify-center'>
        {OnEmptyComponent ? (
          <OnEmptyComponent />
        ) : (
          <span className='text-slate-500'>No items.</span>
        )}
      </div>
    );
  }

  return (
    <div className='flex flex-col w-full flex-1 overflow-y-scroll max-h-full'>
      {data.map((item, i) => {
        return (
          <React.Fragment key={keyExtractor?.(item)}>
            <AdProvider.Injector adElement={adElement}>
              <RenderComponent item={item} />
            </AdProvider.Injector>

            {i < data.length - 1 ? <Separator /> : null}
          </React.Fragment>
        );
      })}
      <Sentinel onVisible={() => fetchNextPage()} />
    </div>
  );
}
