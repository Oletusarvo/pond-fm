import { createHandler } from "@pondfm/server-utils";
import { db } from "../../../../db-config";
import { tablenames } from "../../../../tablenames";
import { loadSql } from "../../../../utils/load-sql";
import { TAuthenticatedRequest } from "../../../../types/request";

export const getPlayCountStatsHandler = createHandler(async (req: TAuthenticatedRequest, res) => {
  const session = req.session;
  const { q } = req.query as { q: string };
  let sql: string;
  if (q === "week") {
    sql = await loadSql("generate-play-counts-last-7-days.sql");
  } else if (q === "month") {
    sql = await loadSql("generate-play-counts-last-30-days.sql");
  } else {
    sql = await loadSql("generate-play-counts-last-12-months.sql");
  }

  const tracks = await db
    .from(db.raw(`(${sql})`))
    .select("*")
    .where({
      author_id: session.user.audius_user_id,
    });

  return res.json(tracks);
});
