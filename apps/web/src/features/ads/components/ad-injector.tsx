import React, { ReactNode, useEffect, useMemo, useRef } from "react";
import { create } from "zustand";
import { createProvider } from "../../../utils/create-provider";

type AdsState = {
  adsSeen: number;
  postsSeen: number;
  incrementSeenAds: () => void;
  incrementSeenPosts: () => void;
};

const useAdStore = create<AdsState>((set, get) => ({
  adsSeen: 0,
  postsSeen: 0,
  incrementSeenAds: () =>
    set((state) => {
      return {
        ...state,
        adsSeen: state.adsSeen + 1,
      };
    }),
  incrementSeenPosts: () =>
    set((state) => {
      return {
        ...state,
        postsSeen: state.postsSeen + 1,
      };
    }),
  getSeenAds: () => get().adsSeen,
  getSeenPosts: () => get().postsSeen,
}));

export const [AdProvider, useAdContext] = createProvider({
  contextName: "AdContext",
  hook: () => {
    const seenAdCount = useRef(0);
    const seenPostCount = useRef(0);
    const incrementSeenPostCount = (value: number) => seenPostCount.current + value;
    const incrementSeenAdCount = (value: number) => seenAdCount.current + value;
    return {
      seenAdCount,
      seenPostCount,
      incrementSeenPostCount,
      incrementSeenAdCount,
    };
  },
});

type AdInjectorProps = React.PropsWithChildren & {
  adElement?: ReactNode;
  enabled?: boolean | (() => boolean);
  interval: number;
};

export function AdInjector({ children, adElement, interval, enabled = false }: AdInjectorProps) {
  const { incrementSeenPostCount, incrementSeenAdCount, seenPostCount } = useAdContext();
  const hasRenderedAd = useRef(false);
  const getWetChildren = () => {
    const renderAds = typeof enabled === "function" ? enabled() : enabled;
    if (!renderAds) return children;
    const trigger = interval;
    return React.Children.map(children, (child, i) => {
      const numChildren = React.Children.count(children);
      const index = i + 1; //Skip rendering ad on the first item.

      const shouldRenderAd =
        i < numChildren - 1
          ? index % trigger === 0
          : //Render an ad after the last child if one hasn't been rendered yet. Do not flip back to false on re-renders; making the ad disappear.
            hasRenderedAd.current || !hasRenderedAd.current;
      if (shouldRenderAd) {
        hasRenderedAd.current = true;
        incrementSeenAdCount(1);
        return (
          <>
            {child}
            {adElement || (
              <div className='bg-primary/10 w-full p-8 rounded-md shrink-0 flex h-8 items-center justify-center'>
                <h2 className='text-lg font-semibold'>Ad goes here.</h2>
              </div>
            )}
          </>
        );
      }
      return child;
    });
  };

  const wetChildren = useMemo(getWetChildren, [children, interval, enabled]);

  return wetChildren;
}
