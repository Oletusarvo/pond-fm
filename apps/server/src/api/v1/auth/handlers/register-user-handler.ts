import { getLookupQuery } from "../../../../DAL/util/get-lookup-query";
import { db } from "../../../../db-config";
import { tablenames } from "../../../../tablenames";
import { createHandler } from "../../../../utils/create-handler";
import { verifyJWT } from "../../../../utils/jwt";

export const registerUserHandler = createHandler(
  async (req, res) => {
    const token = req.body.token;
    const payload = verifyJWT(token) as { email: string; username: string };
    const { email, username } = payload;
    await db.transaction(async trx => {
      const [user] = await trx(tablenames.users).insert({ username, email }).returning('id');
      await trx(tablenames.subscriptions).insert({
        user_id: user.id,
        plan_id: getLookupQuery(tablenames.plans, 'free'),
      });
    });
    return res.end();
  }
)