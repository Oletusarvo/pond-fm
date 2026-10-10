import React, { ReactNode, useCallback, useMemo, useRef, useState } from "react";
import { createProvider } from "../../../utils/create-provider";
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
        const { itemsSeen, enabled, interval } = hook();
        const [renderAd, setRenderAd] = useState(false);
        const onVisible = useCallback(() => {
          //Count items seen only once.
          if (hasCounted.current) return;

          hasCounted.current = true;
          ++itemsSeen.current;

          if (itemsSeen.current % interval === 0) {
            setRenderAd(true);
          }
        }, [setRenderAd, itemsSeen.current]);

        const { ref: itemRef } = useSentinel({
          threshold: 0.5,
          onVisible,
        });

        const hasCounted = useRef(false);
        const shouldRenderAd = enabled && renderAd;
        const itemElement = useMemo(
          () => <PassProps ref={itemRef}>{children}</PassProps>,
          [children, itemRef],
        );
        const adToRender = useMemo(
          () => (adElement ? <PassProps>{adElement}</PassProps> : <DefaultAdElement />),
          [adElement],
        );
        return (
          <>
            {itemElement}
            {shouldRenderAd ? adToRender : null}
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
