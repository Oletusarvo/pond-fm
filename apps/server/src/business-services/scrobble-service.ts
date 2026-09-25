import { Knex } from "knex";
import { ScrobbleRepository } from "../repositories/scrobble-repository";
import { tablenames } from "../tablenames";
import { DBContext } from "../types/db-context";
import { ServiceSuccessResponse } from "../types/service-response";
import { TrackAndUserId } from "../types/track-type";

export class ScrobbleService {
  constructor(private repo: ScrobbleRepository) {}

  /**Attempts to create a unique listener, and if one is created, increments the unique play count on the track. */
  async countUniqueListener(
    listener: TrackAndUserId & { session_id: string },
    ctx: Knex.Transaction,
  ) {
    const listenerCreated = await this.repo.createUniqueListener(listener, ctx);
    if (listenerCreated) {
      await this.repo.incrementUniquePlayCount(listener.track_id, ctx);
    }
    return { success: true };
  }

  /**Counts a play on a track and attempts to create a unique listener. If a listener is created, increments the unique listener count of the track. */
  async countPlay(listener: TrackAndUserId & { session_id: string }, ctx: Knex.Transaction) {
    await this.repo.incrementPlayCount(listener.track_id, ctx);
    return { success: true } as ServiceSuccessResponse<void>;
  }

  /**Creates a new listen-event on a track. */
  async createPlayEvent(event: { user_id: string; track_id: string }, ctx: DBContext) {
    await ctx(tablenames.playData).insert({
      user_id: event.user_id,
      track_id: event.track_id,
    });
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
