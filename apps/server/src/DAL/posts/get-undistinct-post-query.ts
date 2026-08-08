
import { DBContext } from "../../types/db-context";
import { fromUndistinctPost } from "./from/from-undistinct-post";
import { getPostQuery } from "./get-post-query";
import { withUndistinctPost } from "./with/with-undistinct-post";

export function getUndistinctPostQuery(ctx: DBContext) {
  const query = getPostQuery(ctx);
  withUndistinctPost(query);
  fromUndistinctPost(query);
  return query;
}