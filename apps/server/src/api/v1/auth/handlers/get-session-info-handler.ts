import { createHandler } from "@pondfm/server-utils";
import { TAuthenticatedRequest } from "../../../../types/request";

/**Returns the session object encoded by the authenticated user's token. */
export const getSessionInfoHandler = createHandler(
  async (req: TAuthenticatedRequest, res) => {
    return res.json(req.session);
  },
);
