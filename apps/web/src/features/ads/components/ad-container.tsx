import { useEffect, useRef, useState } from "react";

const AD_CONTAINER_ID = "container-57d1ae3dbb6350d1a44008dd920f4ebe";

const AD_SCRIPT_SRC =
  "https://pl31428127.profitableratecpmnetwork.com/57d1ae3dbb6350d1a44008dd920f4ebe/invoke.js";

export function Ad(props) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Prevent loading the ad more than once for this component instance.
    if (containerRef.current.querySelector("script")) return;

    const script = document.createElement("script");

    script.async = true;
    script.setAttribute("data-cfasync", "false");
    script.src = AD_SCRIPT_SRC;

    containerRef.current.appendChild(script);
    return () => {
      script?.remove();
    };
  }, []);

  return (
    <div {...props} className='flex flex-col w-full'>
      <div ref={containerRef} id={AD_CONTAINER_ID} />
    </div>
  );
}

declare global {
  interface Window {
    atOptions?: {
      key: string;
      format: string;
      height: number;
      width: number;
      params: Record<string, unknown>;
    };
  }
}

export function AdBanner() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Adsterra's invoke.js reads `window.atOptions` when it executes,
    // so this MUST be set before the script is appended.
    window.atOptions = {
      key: "b6c7f4f0194bb6a0d64a27813b499262",
      format: "iframe",
      height: 90,
      width: 728,
      params: {},
    };

    const script = document.createElement("script");
    script.src = "https://www.highrevenueformat.com/b6c7f4f0194bb6a0d64a27813b499262/invoke.js";
    script.async = true;

    container.appendChild(script);

    return () => {
      script.remove();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      style={{
        width: 728,
        height: 90,
        overflow: "hidden",
      }}
    />
  );
}
