import { db } from "../../../../db-config";
import { createUpload } from "../../../../query/uploads/create-upload";
import { updateUpload } from "../../../../query/uploads/update-upload";
import { AuthenticatedExpressRequest } from "../../../../types/express";
import { createHandler } from "../../../../utils/create-handler";

export const uploadFileHandler = createHandler(
  async (req: AuthenticatedExpressRequest, res) => {
    return res.end();
  }
)