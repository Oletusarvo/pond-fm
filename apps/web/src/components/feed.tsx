import { ReactNode, useEffect } from "react";
import { Separator } from "./separator";
import React from "react";
import { LoadingFiller } from "./loading-filler";
import { useFeedContext } from "../providers/feed-provider";
import { Sentinel } from "./sentinel";
import { useAuthContext } from "../features/auth/providers/auth-provider";
import { Spinner } from "./spinner";

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
  const { data, isLoading, isFetching, isError, hasNextPage, error, fetchNextPage } =
    useFeedContext();

  if (isLoading) {
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
    <ul className='flex flex-col w-full flex-1 overflow-y-scroll max-h-full gap-1'>
      {data.map((item, i) => {
        return (
          <React.Fragment key={keyExtractor?.(item)}>
            <RenderComponent item={item} />
          </React.Fragment>
        );
      })}
      <Sentinel onVisible={() => fetchNextPage()} />
      {isFetching ? (
        <EndOfFeedIndicatorContainer>
          <Spinner />
        </EndOfFeedIndicatorContainer>
      ) : !hasNextPage ? (
        <EndOfFeedIndicatorContainer>
          <p className='text-primary font-semibold w-full text-center'>No more items.</p>
        </EndOfFeedIndicatorContainer>
      ) : null}
    </ul>
  );
}

function EndOfFeedIndicatorContainer({ children }: React.ComponentProps<"div">) {
  return <div className='flex w-full justify-center py-4'>{children}</div>;
}
