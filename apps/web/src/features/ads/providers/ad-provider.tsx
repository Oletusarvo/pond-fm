import React, { ReactNode, useCallback, useMemo, useRef, useState } from "react";
import { createProvider } from "../../../utils/create-provider";
import { useSentinel } from "../../../hooks/use-sentinel";
import { PassProps } from "../../../components/pass-props";
import { Megaphone } from "lucide-react";

type AdProviderProps = {
  interval: number;
  enabled?: boolean | (() => boolean);
};

type AdInjectorProps = React.PropsWithChildren & {
  adElement?: React.FC<any>;
  hideOnInvisible?: boolean;
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
      Injector: function ({
        children,
        adElement: AdElement,
        hideOnInvisible = false,
      }: AdInjectorProps) {
        const { itemsSeen, enabled, interval } = hook();
        const [renderAd, setRenderAd] = useState(false);
        const shouldHideAd = useRef(false);
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
          threshold: 1,
          onVisible,
        });

        const { ref: adRef } = useSentinel({
          threshold: 0,
          onVisible: () => (shouldHideAd.current = true),
          onInvisible: () => {
            if (!shouldHideAd.current || !hideOnInvisible) return;
            setRenderAd(false);
          },
        });

        const hasCounted = useRef(false);
        const shouldRenderAd = enabled && renderAd;
        const itemElement = useMemo(
          () => <PassProps ref={itemRef}>{children}</PassProps>,
          [children, itemRef],
        );

        const adToRender = (
          <AdContainer ref={adRef}>{AdElement ? <AdElement /> : null}</AdContainer>
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

export function AdContainer({ children, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      {...props}
      className='w-full py-4 px-8 rounded-md shrink-0 flex flex-col gap-2 border border-dashed border-olive-500 my-2'
    >
      <div className='flex items-center justify-between w-full'>
        <div className='flex items-center gap-4'>
          <Megaphone size='1rem' color='var(--color-olive-500)' />
          <h2 className='text-lg font-semibold text-olive-500'>Advertisement</h2>
        </div>
        <div className='bg-gray-200 rounded-[100px] px-4 py-2 text-xs'>Ad</div>
      </div>
      <div className='flex w-full justify-center'>{children}</div>
    </div>
  );
}
