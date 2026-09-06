
import { TSession } from "@pondfm/app-shared";
import { DBContext } from "../../types/db-context";
import { fromUndistinctPost } from "./from/from-undistinct-post";
import { getPostQuery } from "./get-post-query";
import { withUndistinctPost } from "./with/with-undistinct-post";

export function getUndistinctPostQuery(ctx: DBContext, session?: TSession) {
  const query = getPostQuery(ctx, session);
  withUndistinctPost(query);
  fromUndistinctPost(query);
  return query;
}