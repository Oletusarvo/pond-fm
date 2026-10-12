import { useEffect, useRef } from "react";

export default function HilltopAds() {
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const script = document.createElement("script");

    script.src =
      "//peacefulbicycle.com/bgX/V.sadgGxl/0/Y-Wqcz/oeom/9GugZuUelJkYP/TScb1OM/TyM-wfMHzjMStpNrzNU/xZMWz/AEzPN/wS";

    script.async = true;
    script.referrerPolicy = "no-referrer-when-downgrade";
    (script as any).settings = {};

    container.appendChild(script);

    return () => {
      script.remove();
    };
  }, []);

  return <div ref={containerRef} className='hilltop-ads' />;
}
