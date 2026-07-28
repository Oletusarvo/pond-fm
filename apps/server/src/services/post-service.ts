import { DBContext } from '../types/db-context';
import { Knex } from 'knex';
import { PostRepository } from '../repositories/post-repository';
import { TCursor } from '../types/cursor';
import { serviceError } from '../utils/service-error';
import {
  ServiceErrorResponse,
  ServiceResponse,
  ServiceSuccessResponse,
} from '../types/service-response';
import { tryCatch } from '../utils/try-catch';
import { TSession } from '../types/session';
import { createJWT } from '../utils/jwt';
import { v4 } from 'uuid';
/**Responsible for handling business-logic related to tracks, and to call a TrackRepository to intercat with the database. */
export class FeedService {
  constructor(private repo: PostRepository) {}

  async findTrackById(id: string, ctx: DBContext) {
    const data = await this.repo.findTrackById(id, ctx);
    return { success: true, data } as ServiceSuccessResponse<any>;
  }

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
    return { success: true, data: this.repo.withCursor(data) } as ServiceSuccessResponse<{
      tracks: any[];
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
    query.where('track.play_count', '<', 100).orderBy('created_at', 'desc');
    const data = await query;

    return {
      success: true,
      data: this.repo.withCursor(data),
    } as ServiceSuccessResponse<{
      tracks: any[];
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
    return {
      success: true,
      data: this.repo.withCursor(data),
    } as ServiceSuccessResponse<{
      tracks: any[];
      cursor: string | null;
    }>;
  }

  /**Returns the curated track feed for a user. */
  async getCuratedFeed(userId: string, cursor: TCursor | null, ctx: DBContext) {
    throw new Error('getCuratedFeed: Method not implemented!');
  }

  async create(
    payload: {
      id?: string;
      title: string;
      userId: string;
      tags: string[];
      duration: number;
      file: Record<string, any>;
      waveform: number[];
    },
    trx: Knex.Transaction,
  ) {
    await this.repo.createTrack(
      {
        id: payload.id,
        title: payload.title,
        userId: payload.userId,
        tags: payload.tags,
        duration: payload.duration,
        filename: payload.file.filename,
        waveform: payload.waveform,
      },
      trx,
    );
    return { success: true } as ServiceSuccessResponse;
  }

  async countPlay(trackId: string, ctx: DBContext) {
    await this.repo.countPlay(trackId, ctx);
  }

  async repostTrack(payload: { trackId: string; userId: string }, ctx: DBContext) {
    const [result, err] = await tryCatch(async () => await this.repo.createPost(payload, ctx));
    if (err) {
      if (err.message.toLowerCase().includes('duplicate')) {
        return { success: false, error: serviceError.post.duplicateRepost };
      } else {
        throw err;
      }
    }
    return { success: true };
  }

  async unrepostTrack(payload: { userId: string; trackId: string }, ctx: DBContext) {
    await this.repo.deletePost(payload, ctx);
    return { success: true } as ServiceSuccessResponse;
  }

  /**Likes a posted track. */
  async likeTrack(
    payload: {
      trackId: string;
      userId: string;
    },
    ctx: DBContext,
  ) {
    return await this.repo
      .createTrackLike(payload, ctx)
      .then(() => {
        return { success: true } as ServiceSuccessResponse;
      })
      .catch(err => {
        const msg = err.message.toLowerCase();

        if (msg.includes('duplicate') && msg.includes('track_like_data_unique')) {
          return { success: false, error: serviceError.post.duplicateLike } as ServiceErrorResponse;
        } else {
          throw err;
        }
      });
  }

  async unlikeTrack(payload: { userId: string; trackId: string }, ctx: DBContext) {
    await this.repo.deleteTrackLike(payload, ctx);
    return { success: true } as ServiceSuccessResponse<void>;
  }

  findMany(cursor: TCursor | null, ctx: DBContext) {
    const data = this.repo.findMany(cursor, ctx);
    return { success: true, data } as ServiceSuccessResponse;
  }

  async updateTrackTags(
    payload: { editorId: string; trackId: string; tags: string[] },
    trx: Knex.Transaction,
  ): Promise<ServiceResponse> {
    const track = await this.repo.getAuthorByTrackId(payload.trackId, trx);
    if (track.user_id !== payload.editorId) {
      return {
        success: false,
        error: serviceError.auth.forbidden,
      };
    }
    await this.repo.updateTrackTags({ trackId: payload.trackId, tags: payload.tags }, trx);
    return { success: true, data: null };
  }

  /**Returns a token allowing fetching of streams and counting plays.
   * @todo */
  async createStreamToken(trackId: string, ctx: DBContext) {
    const track = await this.repo.findTrackById(trackId, ctx);
    const streamStarted = Date.now();
    //Stream start + duration of the track + a grace period of 10 seconds, in milliseconds.
    const expires = streamStarted + track.duration * 1000 + 10000;
    const threshold =
      track.duration <= 30
        ? 1
        : track.duration <= 60
          ? 30 / track.duration
          : track.duration <= 480
            ? 0.5
            : null;
    const requiredListenTime = threshold ? threshold * track.duration : 240;
    const countValidAt = streamStarted + requiredListenTime * 1000;
    const token = createJWT({
      id: v4(),
      trackId: track.id,
      streamStarted: streamStarted,
      expires,
      countValidAt,
    });
    return { success: true, data: token } as ServiceSuccessResponse<string>;
  }
}
