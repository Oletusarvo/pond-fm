import { useEffect, useRef, useState } from "react";
import { Sentinel } from "./sentinel";

const AD_CONTAINER_ID = "container-57d1ae3dbb6350d1a44008dd920f4ebe";

const AD_SCRIPT_SRC =
  "https://pl31428127.profitableratecpmnetwork.com/57d1ae3dbb6350d1a44008dd920f4ebe/invoke.js";

export function Ad() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [shouldRender, setShouldRender] = useState(true);
  useEffect(() => {
    if (!containerRef.current) return;

    let script: HTMLScriptElement;
    if (shouldRender) {
      // Prevent loading the ad more than once for this component instance.
      if (containerRef.current.querySelector("script")) return;

      script = document.createElement("script");

      script.async = true;
      script.setAttribute("data-cfasync", "false");
      script.src = AD_SCRIPT_SRC;

      containerRef.current.appendChild(script);
      return () => {
        script?.remove();
      };
    } else {
      script?.remove();
    }
  }, [shouldRender]);

  return (
    <div className='flex flex-col w-full'>
      <Sentinel
        onVisible={() => setShouldRender(true)}
        onInvisible={() => setShouldRender(false)}
      />
      <div ref={containerRef} id={AD_CONTAINER_ID} />
    </div>
  );
}
