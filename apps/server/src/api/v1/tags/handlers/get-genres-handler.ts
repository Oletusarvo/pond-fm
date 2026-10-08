import { db } from "../../../../db-config";
import { tablenames } from "../../../../tablenames";
import { createHandler } from "@pondfm/server-utils";

/**Returns all genres. */
export const getGenresHandler = createHandler(async (req, res) => {
  const genres = await db(tablenames.genres).orderBy("label", "asc").pluck("label");
  return res.json(genres);
});
