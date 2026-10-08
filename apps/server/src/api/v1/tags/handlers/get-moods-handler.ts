import { db } from "../../../../db-config";
import { tablenames } from "../../../../tablenames";
import { createHandler } from "@pondfm/server-utils";

/**Returns all moods. */
export const getMoodsHandler = createHandler(async (req, res) => {
  const moods = await db(tablenames.moods).orderBy("label", "asc").pluck("label");
  return res.json(moods);
});
