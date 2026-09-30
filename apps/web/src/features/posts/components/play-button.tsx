import { Pause, Play } from "lucide-react";
import { useClassName } from "../../../hooks/use-class-name";
import { usePlaybackContext } from "../../audio/providers/playback-provider";
import { Spinner } from "../../../components/spinner";
import React from "react";

type PlayButtonProps = Pick<React.ComponentProps<"button">, "onClick"> & {
  state: ReturnType<typeof usePlaybackContext>["playbackState"] | "buffering" | "error";
  size?: "default" | "small";
};

export const PlayButton = function ({ onClick, state, size = "default" }: PlayButtonProps) {
  const className = useClassName(
    state === "playing" ? "bg-green-500" : state === "error" ? "bg-orange-500" : "bg-primary",
    size === "small" ? "p-2" : "p-3",
    "flex rounded-full aspect-square items-center justify-center active:scale-95 cursor-pointer transform-all duration-100",
  );

  return (
    <button className={className} onClick={onClick}>
      {state === "playing" ? (
        <Pause color='white' size='1.2em' />
      ) : state === "buffering" ? (
        <Spinner size='1.2rem' />
      ) : (
        <Play color='white' size='1.2rem' />
      )}
    </button>
  );
};
