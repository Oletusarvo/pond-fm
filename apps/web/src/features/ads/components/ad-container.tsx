import { AdScript } from "./ad-script";
import React, { useEffect, useRef } from "react";

const AD_CONTAINER_ID = "container-57d1ae3dbb6350d1a44008dd920f4ebe";

export function Ad(props: React.ComponentProps<"div">) {
  return <div {...props} id={AD_CONTAINER_ID} className='flex flex-col w-full min-h-2' />;
}

const AD_KEY = "b6c7f4f0194bb6a0d64a27813b499262";
const SCRIPT_URL = `https://www.highrevenueformat.com/${AD_KEY}/invoke.js`;

export default function AdsterraBanner() {
  const adRef = useRef(null);

  useEffect(() => {
    const container = adRef.current;
    if (!container) return;

    // Configure the Adsterra banner
    (window as any).atOptions = {
      key: AD_KEY,
      format: "iframe",
      height: 90,
      width: 728,
      params: {},
    };

    // Load the ad script inside this component
    const script = document.createElement("script");
    script.src = SCRIPT_URL;
    script.async = true;

    container.appendChild(script);

    return () => {
      script.remove();
    };
  }, []);

  return (
    <div
      ref={adRef}
      className='w-full overflow-hidden'
      style={{
        width: "100%",
        minHeight: "90px",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        overflow: "hidden",
      }}
    />
  );
}
