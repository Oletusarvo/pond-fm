import { NotificationRepository } from '../repositories/notification-repository';
import { TCursor } from '../types/cursor';
import { DBContext } from '../types/db-context';
import { TNotification } from '../types/notification-type';
import { FeedBuilder } from '../utils/feed-builder';

export class NotificationService {
  constructor(private repo: NotificationRepository) {}
  async createNotification(payload: TNotification, ctx: DBContext) {
    await this.repo.createNotification(payload, ctx);
    return { success: true };
  }

  async markNotificationAs(
    payload: {
      id: string;
      isSeen: boolean;
    },
    ctx: DBContext,
  ) {
    await this.repo.markNotificationAs(payload, ctx);
    return { success: true };
  }

  async getNotifications(cursor: TCursor | null, userId: string, ctx: DBContext) {
    const feedBuilder = new FeedBuilder(10);
    const data = await this.repo.getBaseFeedQuery(cursor, userId, ctx);
    return { success: true, data: feedBuilder.withCursor(data) };
  }
}
