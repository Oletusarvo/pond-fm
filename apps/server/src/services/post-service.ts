import { DBContext } from '../types/db-context';
import { Knex } from 'knex';
import { PostRepository } from '../repositories/post-repository';
import { TCursor } from '../types/cursor';
import { serviceError } from '../utils/service-error';
import {
  ServiceErrorResponse,
  ServiceErrorValue,
  ServiceResponse,
  ServiceSuccessResponse,
} from '../types/service-response';
import { tryCatch } from '../utils/try-catch';
import { db } from '../db-config';
import { tablenames } from '../tablenames';
import { TSession } from '../types/session';
import { createJWT } from '../utils/jwt';
import { v4 } from 'uuid';
import { createCursor, encodeCursor } from '../utils/cursor';
import { withCursor } from '../utils/with-cursor';
/**Responsible for handling business-logic related to tracks, and to call a TrackRepository to intercat with the database. */
export class PostService {
  constructor(private repo: PostRepository) {}

  private prepareData(data: any[], pageSize: number) {
    return data.length > pageSize ? data.slice(0, -1) : data;
  }

  private withCursor(data: any[], pageSize: number) {
    return {
      tracks: this.prepareData(data, pageSize),
      cursor: createCursor(data, pageSize),
    };
  }

  async findTrackById(id: string, ctx: DBContext) {
    const data = await this.repo.findTrackById(id, ctx);
    return { success: true, data } as ServiceSuccessResponse<any>;
  }

  /**Returns the global feed ordered by upload date in descending order. */
  async getMainFeed(cursor: TCursor | null, ctx: DBContext) {
    const data = await this.repo.findMany(cursor, ctx).orderBy('created_at', 'desc');
    return { success: true, data } as ServiceSuccessResponse<{ id: string; created_at: string }[]>;
  }

  async getDiscoveryFeed(cursor: TCursor | null, session: TSession | null, ctx: DBContext) {
    const pageSize = 3;
    const query = this.repo.getBaseQuery(ctx);
    this.repo.selectPost(query, session);
    this.repo.selectTrack(query);
    query
      .where('track.play_count', '<', 100)
      .limit(pageSize + 1)
      .orderBy('created_at', 'desc');

    if (cursor) {
      query.where('post.created_at', '<=', cursor.timestamp).whereNot({ 'post.id': cursor.id });
    }

    const data = await query;

    return {
      success: true,
      data: this.withCursor(data, pageSize),
    } as ServiceSuccessResponse<{
      tracks: any[];
      cursor: string;
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
    const track = await this.repo.findTrackById(trackId, ctx).first();
    const token = await createJWT(
      {
        id: v4(),
        streamStarted: Date.now(),
        expires: 0, //Stream start + duration of the track.
      },
      {
        expiresIn: '30min',
      },
    );
    return token;
  }
}
