import { Knex } from 'knex';
import { db } from '../db-config';
import { tablenames } from '../tablenames';
import { DBContext } from '../types/db-context';
import { TNotification } from '../types/notification-type';
import { Repository } from './repository';
import { TCursor } from '../types/cursor';
import { markNotificationAs } from '../DAL/notifications/mark-notifications-as';
import { createNotification } from '../DAL/notifications/create-notification';

export class NotificationRepository {
  markNotificationAs = markNotificationAs
  createNotification = createNotification
}
