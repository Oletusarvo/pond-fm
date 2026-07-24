import { authService, userService } from '../../../../container';
import { db } from '../../../../db-config';
import { emailService } from '../../../../services/email-service';
import { createHandler } from '../../../../utils/create-handler';

/**Creates a new auth token and user - if it doesn't exist - for authorization. */
export const requestAuthorizationHandler = createHandler(async (req, res) => {
  const { email, username } = req.body;
  await db.transaction(async trx => {
    const user = await userService.createIfNotExists({ email, username }, trx);

    //Create an auth token and a database entry with a temporary code.
    const code = await authService.createAuthorizationCode(user.data.id, trx);
    //await userService.activateById(user.data.id, trx);
    console.log('Temporary code log(remove once email is implemented): ', code);
    //await emailService.sendMagicLink(email, code.data);
  });
  return res.end();
});
