
import { DBContext } from "../../types/db-context";
import { fromDistinctPost } from "./from/from-distinct-post";
import { getPostQuery } from "./get-post-query";
import { withDistinctPost } from "./with/with-distinct-post";

export function getDistinctPostQuery(ctx: DBContext) {
  const query = getPostQuery(ctx);
  withDistinctPost(query);
  fromDistinctPost(query);
  return query;
}