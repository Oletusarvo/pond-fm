import { useState } from 'react';
import { apiService } from '../../../utils/api-service';

/**Provides functionality for tracking plays on tracks. */
export function usePlayCount() {
  const [lastCountedTrackId, setLastCountedTrackId] = useState(null);
  const countPlay = (trackId: string) => {
    apiService
      .countPlay(trackId)
      .then(res => {
        if (res.ok) {
          setLastCountedTrackId(trackId);
        }
      })
      .catch(err => {
        console.log(err.message);
      });
  };
  return { lastCountedTrackId, countPlay };
}
