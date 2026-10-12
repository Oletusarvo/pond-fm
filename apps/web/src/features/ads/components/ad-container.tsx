import { useEffect, useRef, useState } from "react";
import { useBreakpoint } from "../../../hooks/use-breakpoint";

export default function BaseBannerAd({
  atOptions,
  scriptUrl,
  ...props
}: {
  atOptions: Record<string, any>;
  scriptUrl: string;
}) {
  const adRef = useRef(null);

  useEffect(() => {
    const container = adRef.current;
    if (!container) return;

    // Configure the Adsterra banner
    (window as any).atOptions = atOptions;

    // Load the ad script inside this component
    const script = document.createElement("script");
    script.src = scriptUrl;
    script.async = true;

    container.appendChild(script);

    return () => {
      script.remove();
      delete (window as any).atOptions;
    };
  }, []);

  return (
    <div {...props} className='w-full'>
      <div
        ref={adRef}
        style={{
          width: "100%",
          minHeight: atOptions.height,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          overflow: "hidden",
        }}
      />
    </div>
  );
}

export function BannerAd({ ...props }) {
  const breakpoint = useBreakpoint();
  const renderedAd =
    breakpoint === "xs" ? (
      <BaseBannerAd
        {...props}
        scriptUrl='https://www.highrevenueformat.com/c578292fe9f7ca275651caa326bf7853/invoke.js'
        atOptions={{
          key: "c578292fe9f7ca275651caa326bf7853",
          format: "iframe",
          height: 50,
          width: 320,
          params: {},
        }}
      />
    ) : breakpoint !== null ? (
      <BaseBannerAd
        {...props}
        scriptUrl='https://www.highrevenueformat.com/b6c7f4f0194bb6a0d64a27813b499262/invoke.js'
        atOptions={{
          key: "b6c7f4f0194bb6a0d64a27813b499262",
          format: "iframe",
          height: 90,
          width: 728,
          params: {},
        }}
      />
    ) : null;

  return renderedAd;
}
