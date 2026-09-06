import { TUser } from "@pondfm/app-shared";
import { emailService } from "../../../../services/email-service";
import { createHandler } from "../../../../utils/create-handler";
import { createJWT } from "../../../../utils/jwt";

/**Sends a JWT token to an email for ownership verification. */
export const requestRegistrationHandler = createHandler(
  async (req, res) => {
    const { email, username } = req.body as Pick<TUser, 'email' | 'username'>;
    const token = createJWT({ email, username } as TUser, { expiresIn: '24h' });
    if (process.env.AUTH_ENVIRONMENT === 'production') {
      await emailService.sendMagicLink(email, token);
    }
    else {
      console.log('Temporary registration token log. Send magic link in production. Token: ', token);
    }
    res.end();
  }
)