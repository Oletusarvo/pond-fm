import { useCallback, useRef } from "react";
import { apiService } from "../../../utils/api-service";

type EventType = 'track-played' | 'track-liked' | 'track-unliked';

export function useEvents() {
  const eventsRef = useRef(new EventTarget());
  const countPlay = useCallback((trackId: string) => {
    apiService
      .countPlay(trackId)
      .then(res => {
        if (res.ok) {
          eventsRef.current.dispatchEvent(
            new CustomEvent<{ id: string }>('track-played', {
              detail: { id: trackId },
            }),
          );
        }
      })
      .catch(err => {
        console.log(err.message);
      });
  }, []);

  const registerTrackLike = (trackId: string) => {
    eventsRef.current.dispatchEvent(new CustomEvent('track-liked', {
      detail: {
        id: trackId
      }
    }));
  }

  const registerTrackUnlike = (trackId: string) => {
    eventsRef.current.dispatchEvent(new CustomEvent('track-unliked', {
      detail: {
        id: trackId
      }
    }));
  }

  const addEventListener = (type: EventType, callback: any) => {
    eventsRef.current.addEventListener(type, callback);
  };

  const removeEventListener = (type: EventType, callback: any) => {
    eventsRef.current.removeEventListener(type, callback);
  };

  return {
    countPlay, registerTrackLike, registerTrackUnlike, addEventListener, removeEventListener
  }
}