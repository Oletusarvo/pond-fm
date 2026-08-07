import { DBContext } from "../../types/db-context";
import { fromUpload } from "./from/from-upload";
import { selectUpload } from "./select/select-upload";
import { withUpload } from "./with/with-upload";

export function getUploadQuery(ctx: DBContext) {
  const query = ctx.queryBuilder();
  withUpload(query);
  fromUpload(query);
  selectUpload(query);
  return query;
}