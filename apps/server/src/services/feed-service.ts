import { FeedRepository } from '../repositories/feed-repository';
import { TCursor } from '../types/cursor';
import { DBContext } from '../types/db-context';
import { ServiceSuccessResponse } from '../types/service-response';
import { TSession } from '../types/session';
import { FeedBuilder } from '../utils/feed-builder';

/**Responsible for fetching feeds.*/
export class FeedService {
  constructor(private repo: FeedRepository) {}
  /**Returns the global feed ordered by upload date in descending order. */
  async getMainFeed(
    cursor: TCursor | null,
    session: TSession | null,
    tag: string | null,
    ctx: DBContext,
  ) {
    const query = this.repo.getFeedQuery(cursor, session, tag, ctx);
    query.orderBy('created_at', 'desc');
    const data = await query;
    const feedBuilder = new FeedBuilder(10);
    return { success: true, data: feedBuilder.withCursor(data) } as ServiceSuccessResponse<{
      items: any[];
      cursor: string | null;
    }>;
  }

  /**Returns the feed of undiscovered tracks; tracks with less than 100 unique listeners. */
  async getUndiscoveredFeed(
    cursor: TCursor | null,
    session: TSession | null,
    tag: string | null,
    ctx: DBContext,
  ) {
    const query = this.repo.getFeedQuery(cursor, session, tag, ctx);
    query.where('track.unique_play_count', '<', 100).orderBy('created_at', 'desc');
    const data = await query;
    const feedBuilder = new FeedBuilder(10);
    return {
      success: true,
      data: feedBuilder.withCursor(data),
    } as ServiceSuccessResponse<{
      items: any[];
      cursor: string | null;
    }>;
  }

  /**Returns tracks by a specific author. */
  async getAuthorFeed(
    authorId: string,
    cursor: TCursor | null,
    session: TSession | null,
    ctx: DBContext,
  ) {
    const query = this.repo.getFeedQuery(cursor, session, null, ctx);
    query.where({ 'track_author.id': authorId });
    query.orderBy('created_at', 'desc');
    const data = await query;
    const feedBuilder = new FeedBuilder(10);
    return {
      success: true,
      data: feedBuilder.withCursor(data),
    } as ServiceSuccessResponse<{
      items: any[];
      cursor: string | null;
    }>;
  }
}
