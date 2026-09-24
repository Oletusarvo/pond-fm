import { useEffect, useRef, useState } from "react";

const AD_CONTAINER_ID = "container-57d1ae3dbb6350d1a44008dd920f4ebe";

const AD_SCRIPT_SRC =
  "https://pl31428127.profitableratecpmnetwork.com/57d1ae3dbb6350d1a44008dd920f4ebe/invoke.js";

export function Ad(props) {
  const containerRef = useRef<HTMLDivElement>(null);
  /*
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
      script.remove();
    };
  }, []);
*/
  return (
    <div {...props} className='flex flex-col w-full'>
      <div ref={containerRef} id={AD_CONTAINER_ID} />
    </div>
  );
}
