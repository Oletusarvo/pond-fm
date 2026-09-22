import React, { ReactElement, ReactNode, useEffect, useRef, useState } from "react";
import { createProvider } from "../../../utils/create-provider";
import { Ad } from "../components/ad-container";
import { Sentinel } from "../../../components/sentinel";

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
        const hasCounted = useRef(false);

        const onVisible = () => {
          //Count items seen only once.
          if (hasCounted.current) return;

          hasCounted.current = true;
          itemsSeen.current++;
          if (itemsSeen.current % target === interval) {
            setRenderAd(true);
          }
          console.log("Counted item...", itemsSeen.current);
        };

        const onInvisible = () => {
          setRenderAd(false);
        };

        const shouldRenderAd = enabled && renderAd;
        return (
          <>
            <Sentinel onVisible={onVisible} onInvisible={onInvisible} />
            {children}
            {shouldRenderAd ? adElement || <DefaultAdElement /> : null}
          </>
        );
      },
    };
  },
});

function DefaultAdElement() {
  return (
    <div className='bg-primary/10 w-full p-8 rounded-md shrink-0 flex h-8 items-center justify-center'>
      <h2 className='text-lg font-semibold'>Ad goes here.</h2>
    </div>
  );
}
