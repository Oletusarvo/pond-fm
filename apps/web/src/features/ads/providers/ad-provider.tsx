import React, { ReactElement, ReactNode, useEffect, useRef, useState } from "react";
import { createProvider } from "../../../utils/create-provider";
import { Ad } from "../components/ad-container";
import { Sentinel } from "../../../components/sentinel";
import { useInView } from "react-intersection-observer";
import { useSentinel } from "../../../hooks/use-sentinel";
import { PassProps } from "../../../components/pass-props";

type AdProviderProps = {
  interval: number;
  enabled?: boolean | (() => boolean);
};

type AdInjectorProps = React.PropsWithChildren & {
  adElement?: ReactNode;
};

export const [AdProvider, useAdContext] = createProvider({
  contextName: "AdContext",
  hook: ({ interval, enabled }: AdProviderProps) => {
    const itemsSeen = useRef(0);
    const target = interval + 1;

    return {
      itemsSeen,
      enabled: typeof enabled === "function" ? enabled() : enabled,
      interval,
      target,
    };
  },
  extend: (hook) => {
    return {
      /**Injects an Ad after its children when the number of injectors seen hits the interval defined in the AdProvider. */
      Injector: function ({ children, adElement }: AdInjectorProps) {
        const { itemsSeen, enabled, interval, target } = hook();
        const [renderAd, setRenderAd] = useState(false);
        const shouldHide = useRef(false);
        const onVisible = () => {
          //Count items seen only once.
          if (hasCounted.current) return;

          hasCounted.current = true;
          itemsSeen.current++;
          if (itemsSeen.current % target === interval) {
            setRenderAd(true);
          }
        };

        const { ref: itemRef } = useSentinel({
          threshold: 0.5,
          onVisible,
        });

        const { ref: adRef } = useSentinel({
          threshold: 0,
          onVisible: () => (shouldHide.current = true),
          onInvisible: () => {
            if (!shouldHide.current) return;
            setRenderAd(false);
          },
        });

        const hasCounted = useRef(false);

        const shouldRenderAd = enabled && renderAd;
        const renderedAdElement = (
          <PassProps ref={adRef}>{adElement || <DefaultAdElement />}</PassProps>
        );

        const itemElement = <PassProps ref={itemRef}>{children}</PassProps>;

        return (
          <>
            {itemElement}
            {shouldRenderAd ? renderedAdElement : null}
          </>
        );
      },
    };
  },
});

function DefaultAdElement(props) {
  return (
    <div
      {...props}
      className='bg-primary/10 w-full p-8 rounded-md shrink-0 flex h-8 items-center justify-center'
    >
      <h2 className='text-lg font-semibold'>Ad goes here.</h2>
    </div>
  );
}
