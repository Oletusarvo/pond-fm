import { Knex } from 'knex';
import { db } from '../db-config';
import { tablenames } from '../tablenames';
import { DBContext } from '../types/db-context';
import { TNotification } from '../types/notification-type';
import { Repository } from './repository';
import { TCursor } from '../types/cursor';

export class NotificationRepository extends Repository<{ data: string }> {
  private pageSize: number = 10;
  constructor() {
    super({ data: 'none' }, ctx => {
      return ctx({ notifications: tablenames.notifications })
        .with('track', qb => {
          qb.select('id', db.raw("JSON_BUILD_OBJECT('id', id, 'title', title) AS json")).from(
            tablenames.tracks,
          );
        })
        .with('author', qb => {
          qb.select('id', db.raw("JSON_BUILD_OBJECT('id', id, 'username', username) AS json")).from(
            tablenames.users,
          );
        })
        .join(
          { notification_type: tablenames.notificationTypes },
          'notification_type.id',
          'notifications.notification_type_id',
        )
        .join({ recipient: 'author' }, 'recipient.id', 'notifications.recipient_id')
        .leftJoin({ sender: 'author' }, 'sender.id', 'notifications.sender_id')
        .leftJoin({ track: 'track' }, 'track.id', 'notifications.track_id');
    });
  }

  selectTrack(query: Knex.QueryBuilder) {
    query.select('track.json AS track');
  }

  selectNotification(query: Knex.QueryBuilder) {
    query.select(
      'notifications.id',
      'notification_type.label AS type',
      'notifications.created_at',
      'notifications.seen_at',
    );
  }

  selectRecipient(query: Knex.QueryBuilder) {
    query.select('recipient.json AS recipient');
  }
  selectSender(query: Knex.QueryBuilder) {
    query.select('sender.json AS sender');
  }

  orderByCursor(query: Knex.QueryBuilder, cursor: TCursor, dir: 'desc' | 'asc') {
    const comparator = dir === 'asc' ? '>=' : '<=';
    query
      .where('notifications.created_at', comparator, cursor.timestamp)
      .whereNot({ 'notifications.id': cursor.id });
  }

  async getBaseFeedQuery(
    cursor: TCursor | null,
    userId: string,
    orderDir: 'asc' | 'desc',
    ctx: DBContext,
  ) {
    const query = this.getBaseQuery(ctx);
    this.selectNotification(query);
    this.selectRecipient(query);
    this.selectSender(query);
    this.selectTrack(query);
    query.where({ recipient_id: userId });
    if (cursor) {
      this.orderByCursor(query, cursor, orderDir);
    }
    query.orderBy('notifications.created_at', 'desc');
    query.limit(this.pageSize + 1);
    return query;
  }

  async markNotificationAs(payload: { user_id: string; seen: boolean }, ctx: DBContext) {
    await ctx(tablenames.notifications)
      .where({ recipient_id: payload.user_id })
      .update({
        seen_at: payload.seen ? new Date() : null,
      });
  }

  async createNotification(payload: TNotification, ctx: DBContext) {
    const { type, ...rest } = payload;
    await ctx(tablenames.notifications).insert({
      ...rest,
      notification_type_id: db
        .select('id')
        .from(tablenames.notificationTypes)
        .where({ label: payload.type })
        .limit(1),
    });
  }
}
