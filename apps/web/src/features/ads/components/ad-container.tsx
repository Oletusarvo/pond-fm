import { AdScript } from "./ad-script";
import React from "react";

const AD_CONTAINER_ID = "container-57d1ae3dbb6350d1a44008dd920f4ebe";

export function Ad(props: React.ComponentProps<"div">) {
  return (
    <div {...props} className='flex flex-col w-full min-h-2'>
      <div id={AD_CONTAINER_ID} />
      <AdScript />
    </div>
  );
}
