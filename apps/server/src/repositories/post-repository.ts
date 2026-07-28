import { Knex } from 'knex';
import { db } from '../db-config';
import { tablenames } from '../tablenames';
import { Repository } from './repository';
import { DBContext } from '../types/db-context';
import { TSession } from '../types/session';
import { TCursor } from '../types/cursor';
import { createCursor } from '../utils/cursor';

export class PostRepository extends Repository<{ data: string; status: string; likes: string }> {
  private pageSize: number;
  constructor() {
    super(
      {
        data: tablenames.posts,
        status: tablenames.contentStatuses,
        likes: 'track_like_data',
      },
      ctx => {
        return ctx
          .with('author_json', qb => {
            qb.select(
              'id',
              db.raw("JSON_BUILD_OBJECT('id', id, 'username', username) AS json"),
            ).from(tablenames.users);
          })
          .with('track_tags', qb => {
            qb.select('track_tag.track_id', 'tag.label')
              .from({ track_tag: 'track_tag_data' })
              .join({ tag: 'tag_data' }, 'tag.id', 'track_tag.tag_id');
          })
          .from(
            db.raw(
              `(
              SELECT DISTINCT ON (track_id) *
              FROM ??
              ORDER BY track_id, created_at DESC
              ) AS post
          `,
              [this.tablename.data],
            ),
          )
          .join(
            { post_status: tablenames.contentStatuses },
            'post_status.id',
            'post.post_status_id',
          )
          .join({ author: 'author_json' }, 'author.id', 'post.user_id')
          .join({ track: tablenames.tracks }, 'track.id', 'post.track_id')
          .join({ track_author: 'author_json' }, 'track_author.id', 'track.user_id')
          .join('track_tags', 'track_tags.track_id', 'track.id');
      },
    );
    this.pageSize = 10;
  }

  countPlay(trackId: string, ctx: DBContext) {
    return ctx(tablenames.tracks).where({ id: trackId }).increment('play_count');
  }

  findTrackById(id: string, ctx: DBContext) {
    return ctx(tablenames.tracks).where({ id }).first();
  }

  selectPost(query: Knex.QueryBuilder, session?: TSession) {
    query.select(
      'post.id as id',
      'post_status.label as status',
      'post.created_at',
      'track.play_count',
      db.raw('(SELECT COUNT(*) FROM ?? AS likes WHERE likes.track_id = track.id) AS like_count', [
        this.tablename.likes,
      ]),
      db.raw('(SELECT COUNT(*) - 1 FROM ?? WHERE post_data.track_id = track.id) AS repost_count', [
        this.tablename.data,
      ]),
      db.raw('post.user_id = track_author.id AS is_canonical'),
    );

    if (session) {
      query.select(
        db.raw(
          'EXISTS (SELECT 1 FROM ?? likes WHERE track_id = track.id AND user_id = ?) as liked_by_me',
          ['track_like_data', session.user.id],
        ),
      );
    }
    query.select('author.json as author');
  }

  selectTrack(query: Knex.QueryBuilder) {
    query.select(
      db.raw(
        `
        JSON_BUILD_OBJECT(
          'id', track.id, 
          'title', track.title, 
          'author', track_author.json,
          'duration', track.duration,
          'tags', (
            SELECT JSON_AGG(track_tags.label) FROM track_tags
            WHERE 
            track_tags.track_id = track.id
          ),
          'waveform', track.waveform
        ) AS track
      `,
      ),
    );
  }

  prepareData(data: any[]) {
    return data.length > this.pageSize ? data.slice(0, -1) : data;
  }

  withCursor(data: any[]) {
    return {
      tracks: this.prepareData(data),
      cursor: createCursor(data, this.pageSize),
    };
  }

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

  /**Creates a track. Also creates a post for the track. */
  async createTrack(
    payload: {
      id?: string;
      title: string;
      userId: string;
      filename: string;
      duration: number;
      tags: string[];
      waveform: number[];
    },
    ctx: Knex.Transaction,
  ) {
    const { title, userId, tags, filename, id, duration, waveform } = payload;
    const [track] = await ctx(tablenames.tracks)
      .insert({
        id,
        title,
        user_id: userId,
        filename,
        duration,
        waveform: JSON.stringify(waveform),
        track_status_id: db
          .select('id')
          .from(tablenames.contentStatuses)
          .where({ label: 'active' })
          .limit(1),
      })
      .returning('id');

    //Insert tags
    await ctx(tablenames.trackTags).insert(
      tags.map(tag => {
        return {
          track_id: track.id,
          tag_id: db.select('id').from('tag_data').where({ label: tag }).limit(1),
        };
      }),
    );

    //Create post
    await this.createPost(
      {
        trackId: track.id,
        userId,
      },
      ctx,
    );
  }

  async updateTrackTags(
    payload: {
      trackId: string;
      tags: string[];
    },
    trx: Knex.Transaction,
  ) {
    await trx(tablenames.trackTags).where({ track_id: payload.trackId }).del();
    await trx(tablenames.trackTags).insert(
      payload.tags.map(tag => {
        return {
          track_id: payload.trackId,
          tag_id: db.select('id').from(tablenames.tags).where({ label: tag }).limit(1),
        };
      }),
    );
  }

  /**Creates a post of a track. */
  createPost(
    payload: {
      trackId: string;
      userId: string;
    },
    ctx: DBContext,
  ) {
    const { trackId, userId } = payload;
    return ctx('post_data').insert({
      track_id: trackId,
      user_id: userId,
      post_status_id: db
        .select('id')
        .from(tablenames.contentStatuses)
        .where({ label: 'active' })
        .limit(1),
    });
  }

  deletePost(payload: { trackId: string; userId: string }, ctx: DBContext) {
    return ctx(this.tablename.data)
      .where({ track_id: payload.trackId, user_id: payload.userId })
      .del();
  }

  deleteTrack(id: string, ctx: DBContext) {
    return ctx(tablenames.tracks).where({ id }).del();
  }

  findLike(payload: { userId: string; trackId: string }, ctx: DBContext) {
    return ctx(this.tablename.likes)
      .where({ user_id: payload.userId, track_id: payload.trackId })
      .first();
  }

  deleteTrackLike(payload: { userId: string; trackId: string }, ctx: DBContext) {
    return ctx(this.tablename.likes)
      .where({ user_id: payload.userId, track_id: payload.trackId })
      .del();
  }

  createTrackLike(payload: { userId: string; trackId: string }, ctx: DBContext) {
    return ctx(this.tablename.likes).insert({
      track_id: payload.trackId,
      user_id: payload.userId,
    });
  }

  async getAuthorByTrackId(trackId: string, ctx: DBContext) {
    return await ctx(tablenames.tracks).where({ id: trackId }).select('user_id').first();
  }
}
