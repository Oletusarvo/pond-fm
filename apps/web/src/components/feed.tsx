import { ReactNode, useEffect } from "react";
import { useInfiniteFeed } from "../hooks/use-infinite-feed";
import { Separator } from "./separator";
import React from "react";
import { LoadingFiller } from "./loading-filler";
import { useFeedContext } from "../providers/feed-provider";
import { Sentinel } from "./sentinel";
import { AdInjector } from "../features/ads/components/ad-injector";
import { useAuthContext } from "../features/auth/providers/auth-provider";

type FeedScreenProps = {
  adsEnabled?: React.ComponentProps<typeof AdInjector>["enabled"];
  keyExtractor?: (item: any) => string;
  renderComponent: (item: any) => ReactNode;
  onEmptyComponent?: () => ReactNode;
};
export function Feed({
  adsEnabled,
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
    return <span className='text-red-900'>Failed to load feed!</span>;
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
      <AdInjector interval={12} enabled={adsEnabled}>
        {data.map((item, i) => {
          return (
            <React.Fragment key={keyExtractor?.(item)}>
              <RenderComponent item={item} />
              {i < data.length - 1 ? <Separator /> : null}
            </React.Fragment>
          );
        })}
      </AdInjector>

      <Sentinel onVisible={() => fetchNextPage()} />
    </div>
  );
}
