import { authService, userService } from '../../../../container';
import { db } from '../../../../db-config';
import { emailService } from '../../../../services/email-service';
import { createHandler } from '../../../../utils/create-handler';
import { serviceError } from '../../../../utils/service-error';

/**Creates a new auth token and user - if it doesn't exist - for authorization. */
export const requestAuthorizationHandler = createHandler(async (req, res) => {
  const { email } = req.body;
  await db.transaction(async trx => {
    const user = await userService.createIfNotExists(trx, { email });
    if (user.success == false) {
      return res.status(409).json({
        error: serviceError.auth.userQuotaExceeded
      });
    }

    //Create an auth token and a database entry with a temporary code.
    const code = await authService.createAuthorizationCode(trx, { userId: user.data.id });
    if (process.env.AUTH_ENVIRONMENT === 'production') {
      await emailService.sendMagicLink(email, code.data);
    }
    else {
      console.log('Temporary code log(remove once email is implemented): ', code);
    }
  });
  return res.end();
});
