import React, { useRef, useState } from "react";
import { useClassName } from "../../../hooks/use-class-name";
import { Spinner } from "../../../components/spinner";
import { useStatus } from "../../../hooks/use-status";
import { TriangleAlert } from "lucide-react";

type TrackImageProps = React.ComponentProps<"img"> & {
  mirrors: string[];
};
export function TrackImage({ src, mirrors, ...props }: TrackImageProps) {
  const [currentSrc, setCurrentSrc] = useState(new URL(src));
  const { status, loading, setStatus } = useStatus("loading");
  const mirrorIndex = useRef(0);
  const pathname = currentSrc.pathname;

  const handleError = () => {
    //Pick another mirror.
    const mirror = mirrors.at(++mirrorIndex.current);
    if (!mirror) {
      setStatus("error");
      console.log("No working mirror available! Mirrors tried: " + mirrorIndex.current);
      return;
    }

    const newSrc = new URL(`${mirror}${pathname}`);
    setCurrentSrc(newSrc);
  };

  const containerClassName = useClassName(
    props.className,
    "relative aspect-square flex items-center shrink-0 justify-center bg-slate-200",
  );

  const imgClassName = useClassName(props.className, "absolute");
  return (
    <div className={containerClassName}>
      {loading ? (
        <Spinner />
      ) : status === "error" ? (
        <TriangleAlert color='var(--color-red-500)' />
      ) : null}
      <img
        {...props}
        hidden={status !== "success"}
        className={imgClassName}
        src={currentSrc.toString()}
        onError={handleError}
        onLoad={() => setStatus("success")}
      />
    </div>
  );
}
