import { getSearchableFeedHandler } from '../api/v1/tracks/handlers/get-searchable-feed';
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
    const query = this.repo.getFeedQuery(session, tag, ctx);
    query.from({ post: 'post_distinct' });
    if (cursor) {
      this.repo.orderByCursor(query, cursor, 'desc');
    }
    query.orderBy('created_at', 'desc');
    const data = await query;
    const feedBuilder = new FeedBuilder(10);
    return { success: true, data: feedBuilder.withCursor(data) } as ServiceSuccessResponse<{
      items: any[];
      cursor: string | null;
    }>;
  }

  /**Returns the feed of undiscovered tracks; tracks with less than 100 unique listeners, ordered in ascending order by upload time */
  async getUndiscoveredFeed(
    cursor: TCursor | null,
    session: TSession | null,
    tag: string | null,
    ctx: DBContext,
  ) {
    const query = this.repo.getFeedQuery(session, tag, ctx);
    query.from({ post: 'post_undistinct' });

    query
      /*Exclude reposts. */
      .where(function () {
        this.whereRaw('post.user_id = track.user_id');
      })
      .where('track.unique_play_count', '<', 100)
      .orderBy('post.created_at', 'asc');
    if (cursor) {
      this.repo.orderByCursor(query, cursor, 'asc');
    }
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
    const query = this.repo.getFeedQuery(session, null, ctx);
    query.where({ 'track_author.id': authorId });
    query.orderBy('created_at', 'desc');
    if (cursor) {
      this.repo.orderByCursor(query, cursor, 'desc');
    }
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

  async getSearchableFeed(
    q: string | null,
    cursor: TCursor | null,
    session: TSession | null,
    ctx: DBContext,
  ) {
    let data: any = {
      cursor: null,
      data: [],
    };
    if (q) {
      const query = await this.repo.getFeedQuery(session, null, ctx);
      query.where(function () {
        const str = `%${q}%`;
        this.whereILike('track.title', str)
          .orWhereILike('post_author.username', str)
          .orWhereILike('track_author.username', str);
      });
      const feedBuilder = new FeedBuilder(10);
      data = feedBuilder.withCursor(await query);
    }
    return { success: true, data } as ServiceSuccessResponse<any>;
  }
}
