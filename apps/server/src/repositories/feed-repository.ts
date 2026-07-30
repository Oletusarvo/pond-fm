import { TCursor } from '../types/cursor';
import { DBContext } from '../types/db-context';
import { TSession } from '../types/session';
import { createCursor } from '../utils/cursor';
import { PostRepository } from './post-repository';

/**Responsible for database operations related to feeds of posts. */
export class FeedRepository extends PostRepository {
  private pageSize: number;
  constructor() {
    super();
    this.pageSize = 10;
  }

  /**Returns a basic feed query including relevant post, track and author data. */
  getFeedQuery(
    cursor: TCursor | null,
    session: TSession | null,
    tag: string | null,
    ctx: DBContext,
  ) {
    const query = this.getBaseQuery(ctx);
    this.selectPost(query, session);
    this.selectTrack(query);
    query.limit(this.pageSize + 1);
    if (cursor) {
      query.where('post.created_at', '<=', cursor.timestamp).whereNot({ 'post.id': cursor.id });
    }
    if (tag) {
      query.where(function () {
        this.whereILike('track_tags.label', `%${tag}%`);
      });
    }
    return query;
  }
}
