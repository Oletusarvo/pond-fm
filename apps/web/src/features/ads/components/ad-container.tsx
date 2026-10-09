import { AdScript } from "./ad-script";
import React, { useEffect, useRef } from "react";

const AD_CONTAINER_ID = "container-57d1ae3dbb6350d1a44008dd920f4ebe";

export function Ad(props: React.ComponentProps<"div">) {
  return <div {...props} id={AD_CONTAINER_ID} className='flex flex-col w-full min-h-2' />;
}

const AD_KEY = "b6c7f4f0194bb6a0d64a27813b499262";
const SCRIPT_URL = `https://www.highrevenueformat.com/${AD_KEY}/invoke.js`;

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
      <div className='xs:block md:hidden'>
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
      </div>
      <div className='xs:hidden md:block'>
        <BaseBannerAd
          scriptUrl='https://www.highrevenueformat.com/b6c7f4f0194bb6a0d64a27813b499262/invoke.js'
          atOptions={{
            key: "b6c7f4f0194bb6a0d64a27813b499262",
            format: "iframe",
            height: 90,
            width: 728,
            params: {},
          }}
        />
      </div>
    </>
  );
}
