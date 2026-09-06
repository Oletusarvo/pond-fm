import { useCallback, useRef } from "react";
import { cancelable } from "../../../utils/debounced";
import { api } from "../../../utils/api/api";

type EventType = "track-played" | "track-liked" | "track-unliked";

export function useActions() {
  const eventsRef = useRef(new EventTarget());
  const countPlay = useCallback((trackId: string) => {
    api.tracks
      .countPlay(trackId)
      .then((res) => {
        if (res.ok) {
          eventsRef.current.dispatchEvent(
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

  const toggleTrackLike = async (trackId: string, previousState: boolean) => {
    const initialState = previousState;
    const newState = !previousState;
    const eventName = "like-toggled";
    eventsRef.current.dispatchEvent(
      new CustomEvent(eventName, {
        detail: {
          id: trackId,
          state: newState,
        },
      }),
    );
    const result = await cancelable.toggleTrackLike(trackId, initialState);
    if (result.executed) {
      if (result.value.ok) return;
      eventsRef.current.dispatchEvent(
        new CustomEvent(eventName, {
          detail: {
            id: trackId,
            state: initialState,
          },
        }),
      );
    }
  };

  const toggleTrackRepost = async (trackId: string, previousState: boolean) => {
    const initialState = previousState;
    const newState = !initialState;
    const eventName = "repost-toggled";
    eventsRef.current.dispatchEvent(
      new CustomEvent(eventName, {
        detail: {
          id: trackId,
          state: newState,
        },
      }),
    );

    const result = await cancelable.repost(trackId, initialState);
    if (result.executed) {
      if (result.value.ok) return;
      eventsRef.current.dispatchEvent(
        new CustomEvent(eventName, {
          detail: {
            id: trackId,
            state: initialState,
          },
        }),
      );
    }
  };

  const addEventListener = (type: EventType, callback: any) => {
    eventsRef.current.addEventListener(type, callback);
  };

  const removeEventListener = (type: EventType, callback: any) => {
    eventsRef.current.removeEventListener(type, callback);
  };

  return {
    countPlay,
    toggleTrackLike,
    toggleTrackRepost,
    addEventListener,
    removeEventListener,
  };
}
