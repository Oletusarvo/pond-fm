import { Knex } from 'knex';
import { db } from '../db-config';
import { tablenames } from '../tablenames';
import { Repository } from './repository';
import { DBContext } from '../types/db-context';
import { TSession } from '../types/session';
import { TCursor } from '../types/cursor';
import { createCursor } from '../utils/cursor';
import { TrackAndUserId, TTrack } from '../types/track-type';
import { TPost } from '../types/post-type';

export class PostRepository extends Repository<{ data: string; status: string; likes: string }> {
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

          .join({ author: 'author_json' }, 'author.id', 'post.user_id')
          .join({ track: tablenames.tracks }, 'track.id', 'post.track_id')
          .join({ track_author: 'author_json' }, 'track_author.id', 'track.user_id')
          .join('track_tags', 'track_tags.track_id', 'track.id')
          .join(
            { track_status: tablenames.contentStatuses },
            'track_status.id',
            'track.track_status_id',
          );
      },
    );
  }

  findTrackById(id: string, ctx: DBContext) {
    return ctx(tablenames.tracks).where({ id }).first();
  }

  selectPost(query: Knex.QueryBuilder, session?: TSession) {
    query.select(
      'post.id as id',
      'track_status.label as status',
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

      query.select(
        db.raw(
          `
            EXISTS (
              SELECT 1 
              FROM ?? repost 
              WHERE repost.track_id = track.id AND repost.user_id = ? AND NOT track.user_id = ?
              ) as reposted_by_me`,
          ['post_data', session.user.id, session.user.id],
        ),
      );
    }
    query.select('author.json as author');
  }

  /**Applies a select-clause to the provided query, including as a json-object the track referred to by a post.*/
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

  /**Creates a track and a post for the track. */
  async createTrack(payload: TTrack, ctx: Knex.Transaction) {
    const { title, user_id, tags, filename, id, duration, waveform } = payload;
    const [track] = await ctx(tablenames.tracks)
      .insert({
        id,
        title,
        user_id,
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
        track_id: track.id,
        user_id,
      },
      ctx,
    );
  }

  /**Updates the tags associated with a track. */
  async updateTrackTags(
    payload: { track_id: TrackAndUserId['track_id']; tags: TTrack['tags'] },
    trx: Knex.Transaction,
  ) {
    const { track_id, tags } = payload;
    await trx(tablenames.trackTags).where({ track_id }).del();
    await trx(tablenames.trackTags).insert(
      tags.map(tag => {
        return {
          track_id,
          tag_id: db.select('id').from(tablenames.tags).where({ label: tag }).limit(1),
        };
      }),
    );
  }

  /**Creates a post of a track. This does not create a track; use createTrack instead.*/
  createPost(payload: TPost, ctx: DBContext) {
    return ctx('post_data').insert(payload);
  }

  /**Deletes a post. This does not delete the track. */
  deletePost(payload: TrackAndUserId, ctx: DBContext) {
    return ctx(this.tablename.data).where(payload).del();
  }

  /**Deletes a track. Deletion of a track causes the deletion of all posts of it. */
  deleteTrack(id: string, ctx: DBContext) {
    return ctx(tablenames.tracks).where({ id }).del();
  }

  /**Finds a like-record by user and track id. */
  findLike(payload: TrackAndUserId, ctx: DBContext) {
    return ctx(this.tablename.likes).where(payload).first();
  }

  /**Deletes a like by user and track id. */
  deleteTrackLike(payload: TrackAndUserId, ctx: DBContext) {
    return ctx(this.tablename.likes).where(payload).del();
  }

  /**Creates a like by user and track id. */
  createTrackLike(payload: TrackAndUserId, ctx: DBContext) {
    return ctx(this.tablename.likes).insert(payload);
  }

  /**Returns the author of a track by its id. */
  async getAuthorByTrackId(trackId: string, ctx: DBContext) {
    return await ctx(tablenames.tracks).where({ id: trackId }).select('user_id').first();
  }
}
