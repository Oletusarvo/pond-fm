import { useEffect, useRef, useState } from "react";
import { AdScript } from "./ad-script";

const AD_CONTAINER_ID = "container-57d1ae3dbb6350d1a44008dd920f4ebe";

export function Ad(props) {
  const containerRef = useRef<HTMLDivElement>(null);
  return (
    <div {...props} className='flex flex-col w-full'>
      <div ref={containerRef} id={AD_CONTAINER_ID} />
    </div>
  );
}
