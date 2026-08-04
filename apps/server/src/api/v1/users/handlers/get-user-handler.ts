import { db } from "../../../../db-config";
import { tablenames } from "../../../../tablenames";
import { createHandler } from "../../../../utils/create-handler";

export const getUserHandler = createHandler(
  async (req, res) => {
    const { userId } = req.params;
    const user = await db(tablenames.users).where({ id: userId }).select('id', 'username').first();
    return res.json(user);
  }
)