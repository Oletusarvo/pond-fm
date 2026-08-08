import { createNotification } from "../../../../DAL/notifications/create-notification";
import { createFollow } from "../../../../DAL/users/create-follow";
import { db } from "../../../../db-config";
import { AuthenticatedExpressRequest } from "../../../../types/express";
import { createHandler } from "../../../../utils/create-handler";

export const followUserHandler = createHandler(
  async (req: AuthenticatedExpressRequest, res) => {
    const session = req.session;
    await createFollow(db, { followerId: session.user.id, followeeId: req.params.userId as string });
    const notePromise = new Promise<void>(async (resolve, reject) => {
      await createNotification(db, {
        notification: {
          type: 'follow',
          sender_id: session.user.id,
          recipient_id: req.params.userId as string
        }
      });
      resolve();
    });
    notePromise.catch(err => console.log('Failed to create a follow notification!', err.message));
    return res.end();
  }
)