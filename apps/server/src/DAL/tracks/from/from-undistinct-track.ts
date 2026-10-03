import { db } from "../../../db-config";
import { viewnames } from "../../../tablenames";

export function fromUndistinctTrack(query) {
  query
    .with("undistinct_track", (qb) => {
      qb.select("*")
        .from({ track: viewnames.tracks })
        .orderBy(db.raw("post_id, created_at"), "desc");
    })
    .from({ track: "undistinct_track" });
}
