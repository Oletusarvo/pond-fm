import { useEffect, useState } from "react";

const AD_SCRIPT_SRC =
  "https://pl31428127.profitableratecpmnetwork.com/57d1ae3dbb6350d1a44008dd920f4ebe/invoke.js";

/**Renders the Adsterra native banner ad script. */
export function AdScript() {
  const [enabled, setEnabled] = useState(false);
  useEffect(() => {
    setTimeout(() => {
      setEnabled(true);
    }, 25000);
  }, [setEnabled]);
  return enabled ? <script async={true} data-cfasync='false' src={AD_SCRIPT_SRC}></script> : null;
}
