import { useCallback, useRef, useState } from "react";
import { api } from "../../../utils/api/api";

type PlayCountEvent = "track-played";

/**Provides functionality for tracking plays on tracks. */
export function usePlayCount() {
  const playCountRef = useRef(new EventTarget());
  const countPlay = useCallback((trackId: string) => {
    api.tracks
      .countPlay(trackId)
      .then((res) => {
        if (res.ok) {
          playCountRef.current.dispatchEvent(
            new CustomEvent<{ id: string }>("track-played", {
              detail: { id: trackId },
            }),
          );
        }
      })
      .catch((err) => {
        console.log(err.message);
      });
  }, []);

  const addEventListener = (type: PlayCountEvent, callback: any) => {
    playCountRef.current.addEventListener(type, callback);
  };

  const removeEventListener = (type: PlayCountEvent, callback: any) => {
    playCountRef.current.removeEventListener(type, callback);
  };

  return { addEventListener, removeEventListener, countPlay };
}
