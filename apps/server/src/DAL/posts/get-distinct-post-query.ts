
import { TSession } from "@pondfm/app-shared";
import { DBContext } from "../../types/db-context";
import { fromDistinctPost } from "./from/from-distinct-post";
import { getPostQuery } from "./get-post-query";
import { withDistinctPost } from "./with/with-distinct-post";

export function getDistinctPostQuery(ctx: DBContext, session?: TSession) {
  const query = getPostQuery(ctx, session);
  withDistinctPost(query);
  fromDistinctPost(query);
  return query;
}