import { viewnames } from "../../../tablenames";

export function fromUndistinctTrack(query) {
  query
    .with("undistinct_track", (qb) => {
      qb.select("*").from({ track: viewnames.tracks });
    })
    .from({ track: "undistinct_track" });
}
