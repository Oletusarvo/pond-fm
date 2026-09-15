import { Knex } from "knex";
import { ScrobbleRepository } from "../repositories/scrobble-repository";
import { tablenames } from "../tablenames";
import { DBContext } from "../types/db-context";
import { ServiceSuccessResponse } from "../types/service-response";
import { TrackAndUserId } from "../types/track-type";

export class ScrobbleService {
  constructor(private repo: ScrobbleRepository) {}

  /**Counts a play on a track and attempts to create a unique listener. If a listener is created, increments the unique listener count of the track. */
  async countPlay(
    listener: TrackAndUserId & { session_id: string },
    ctx: Knex.Transaction,
  ) {
    await this.repo.incrementPlayCount(listener.track_id, ctx);
    const listenerCreated = await this.repo.createUniqueListener(listener, ctx);
    if (listenerCreated) {
      await this.repo.incrementUniquePlayCount(listener.track_id, ctx);
    }
    /*
    await ctx(tablenames.playData).insert({
      track_id: listener.track_id,
      user_id: listener.user_id,
      session_id: listener.session_id,
    });*/

    return { success: true } as ServiceSuccessResponse<void>;
  }

  /**Prunes unique listener records of tracks with at least 100 unique listens. */
  async pruneUniqueListeners(trackId: string, ctx: DBContext) {
    const counts = await this.repo.getPlayCounts(trackId, ctx);

    if (counts.uniquePlayCount >= 100) {
      await this.repo.deleteUniqueListeners(trackId, ctx);
    }
    return { success: true };
  }
}
