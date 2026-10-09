import { useEffect, useRef } from "react";

export default function BaseBannerAd({
  atOptions,
  scriptUrl,
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
    };
  }, []);

  return (
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
  );
}

export function BannerAd() {
  return (
    <>
      <BaseBannerAd
        scriptUrl='https://www.highrevenueformat.com/c578292fe9f7ca275651caa326bf7853/invoke.js'
        atOptions={{
          key: "c578292fe9f7ca275651caa326bf7853",
          format: "iframe",
          height: 50,
          width: 320,
          params: {},
        }}
      />
    </>
  );
}
