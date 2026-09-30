import { getRouter, createBodyParser } from "@pondfm/server-utils";

import { checkAuth } from "../../middleware/check-auth";
import { followUserHandler } from "./handlers/follow-user-handler";
import { getNotificationsHandler } from "./handlers/get-notifications-handler";
import { getUserFollowers } from "./handlers/get-user-followers";
import { getUserFollowing } from "./handlers/get-user-following";
import { getUserHandler } from "./handlers/get-user-handler";
import { markNotificationsAsSeenHandler } from "./handlers/mark-notifications-as-seen-handler";
import { unfollowUserHandler } from "./handlers/unfollow-user-handler";
import { updateUserHandler } from "./handlers/update-user-handler";
import { deleteUserHandler } from "./handlers/delete-user-handler";
import { getPlayCountStatsHandler } from "../tracks/handlers/get-track-stats-handler";

const router = getRouter();

router.get("/stats", checkAuth(), getPlayCountStatsHandler);
/**
 * GET /users/notifications
 * @summary Returns the notifications of the currently authenticated user.
 * @tags Users
 */
router.get("/notifications", checkAuth(), getNotificationsHandler);

/**
 * PUT /users/notifications/mark-as-seen
 * @summary Marks all notifications of the currently authenticated user as seen.
 * @tags Users
 */
router.put("/notifications/mark-as-seen", checkAuth(), markNotificationsAsSeenHandler);
/**
 * POST /users/follow/:id
 * @summary Adds the currently authenticated user as a follower of another user by id.
 * @tags Users
 */
router.post("/follow/:userId", checkAuth(), followUserHandler);
/**
 * POST /users/unfollow/:id
 * @summary Removes the currently authenticated user from the followers of another by id.
 * @tags Users
 */
router.post("/unfollow/:userId", checkAuth(), unfollowUserHandler);
/**
 * GET /users/followers/:id
 * @summary Returns the followers of a user by id.
 * @tags Users
 */
router.get("/followers/:userId", getUserFollowers);
/**
 * GET /users/following/:id
 * @summary Returns the users another follows by id.
 * @tags Users
 */
router.get("/following/:userId", getUserFollowing);
/**
 * GET /users/:id
 * @summary Returns the public information of a user by id.
 * @tags Users
 */
router.get("/:userId", checkAuth(false), getUserHandler);
router.delete("/", checkAuth(), deleteUserHandler);

export { router as usersRouter };
