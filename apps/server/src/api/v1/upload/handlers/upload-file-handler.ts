import { db } from "../../../../db-config";
import { createUpload } from "../../../../DAL/uploads/create-upload";
import { updateUpload } from "../../../../DAL/uploads/update-upload";
import { AuthenticatedExpressRequest } from "../../../../types/express";
import { createHandler } from "../../../../utils/create-handler";

export const uploadFileHandler = createHandler(
  async (req: AuthenticatedExpressRequest, res) => {
    return res.end();
  }
)