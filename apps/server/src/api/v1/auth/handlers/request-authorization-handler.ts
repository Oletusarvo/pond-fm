import { TUser, userSchema } from "@pondfm/app-shared";
import { services } from "../../../../container";
import { db } from "../../../../db-config";
import { emailService } from "../../../../business-services/email-service";

import { serviceError } from "../../../../utils/service-error";
import { createHandler } from "@pondfm/server-utils";
import { TRequest } from "../../../../types/request";
import z from "zod";

const schema = userSchema.pick({ email: true });

/**Creates a new auth token and user - if it doesn't exist - for authorization. */
export const requestAuthorizationHandler = createHandler(
  async (req: TRequest<z.infer<typeof schema>>, res) => {
    const { email } = req.body;
    await db.transaction(async (trx) => {
      const user = await services.users.createIfNotExists(trx, { email });
      if (user.success == false) {
        return res.status(409).json({
          error: serviceError.auth.userQuotaExceeded,
        });
      }

      //Create an auth token and a database entry with a temporary code.
      const code = await services.auth.createAuthorizationCode(trx, {
        userId: user.data.id,
      });
      if (process.env.AUTH_ENVIRONMENT === "production") {
        await emailService.sendMagicLink(email, code.data);
      } else {
        console.log(
          "Temporary code log(remove once email is implemented): ",
          code,
        );
      }
    });
    return res.end();
  },
);
