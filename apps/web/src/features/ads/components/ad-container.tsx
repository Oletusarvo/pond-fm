import { useEffect, useRef, useState } from "react";
import { AdScript } from "./ad-script";

const AD_CONTAINER_ID = "container-57d1ae3dbb6350d1a44008dd920f4ebe";

export function Ad(props: React.ComponentProps<"div">) {
  const containerRef = useRef<HTMLDivElement>(null);
  return (
    <>
      <div {...props} ref={containerRef} id={AD_CONTAINER_ID} className='flex flex-col w-full' />
      <AdScript />
    </>
  );
}
