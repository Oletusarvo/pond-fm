import { v4 } from 'uuid';
import { tablenames } from '../tablenames';
import { DBContext } from '../types/db-context';
import { TrackAndUserId, TTrack } from '../types/track-type';
import { PostRepository } from './post-repository';

/**Responsible for scrobbling - updating unique listeners and counting plays. */
export class ScrobbleRepository extends PostRepository {
  async getPlayCounts(trackId: string, ctx: DBContext) {
    const result = await ctx(tablenames.tracks)
      .select('play_count as playCount', 'unique_play_count as uniquePlayCount')
      .where({ id: trackId })
      .first();
    return result;
  }

  /**Deletes unique listeners. */
  async deleteUniqueListeners(trackId: string, ctx: DBContext) {
    await ctx(tablenames.uniqueListeners).where(trackId).del();
  }

  /**Inserts a new unique listener. */
  async createUniqueListener(listener: TrackAndUserId & { session_id: string }, ctx: DBContext) {
    const result = await ctx(tablenames.uniqueListeners)
      .insert(listener)
      .onConflict()
      .ignore()
      .returning('id');

    return result.length > 0;
  }

  /**Increments the play count of a track. */
  async incrementPlayCount(trackId: string, ctx: DBContext) {
    const [result] = await ctx(tablenames.tracks)
      .where({ id: trackId })
      .increment('play_count')
      .returning(['play_count AS playCount']);
    return result.playCount;
  }

  /**Increments the unique play count of a track. */
  async incrementUniquePlayCount(trackId: string, ctx: DBContext) {
    const [result] = await ctx(tablenames.tracks)
      .where({ id: trackId })
      .increment('unique_play_count')
      .returning(['unique_play_count AS playCount']);
    return result.playCount;
  }
}
