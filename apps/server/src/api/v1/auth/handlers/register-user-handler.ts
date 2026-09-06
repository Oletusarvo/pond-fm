import { TSubscription, TUser } from "@pondfm/app-shared";
import { db } from "../../../../db-config";
import { tablenames } from "../../../../tablenames";
import { createHandler } from "../../../../utils/create-handler";
import { verifyJWT } from "../../../../utils/jwt";
import { JwtPayload } from "jsonwebtoken";

export const registerUserHandler = createHandler(
  async (req, res) => {
    const token = req.body.token;
    const payload = verifyJWT(token) as JwtPayload & Pick<TUser, 'email' | 'username'>;
    const { email, username } = payload;
    await db.transaction(async trx => {
      const [user] = await trx(tablenames.users).insert({ username, email } as TUser).returning('id') as [Pick<TUser, 'id'>];
      await trx(tablenames.subscriptions).insert({
        user_id: user.id,
        plan_id: 'free',
      } as TSubscription);
    });
    return res.end();
  }
)