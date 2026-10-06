import { getPublicUser } from "../../../../DAL/users/get-public-user";
import { db } from "../../../../db-config";
import { createHandler } from "@pondfm/server-utils";
import { TAuthenticatedRequest } from "../../../../types/request";
import { audius } from "../../../../audius.config";

/**Returns the public data of a user. */
export const getUserHandler = createHandler(async (req: TAuthenticatedRequest, res) => {
  const { userId } = req.params as { userId: string };
  const user = await getPublicUser(db, { id: userId, session: req.session });
  if (user) {
    const [audiusUser] = await audius.users.get([user.id]);
    console.log(audiusUser);
    return res.json({
      ...user,
      username: audiusUser.name,
      bio: audiusUser.bio,
      profile_picture: audiusUser.profile_picture["480x480"],
    });
  }
  return res.json(user);
});
