import { createHandler, createJWT, loadEnvVariable } from "@pondfm/server-utils";
import { TRequest } from "../../../../types/request";
import { db } from "../../../../db-config";
import { tablenames } from "../../../../tablenames";
import { services } from "../../../../container";
import { emailPayloadSchema } from "../../../../schemas/email-payload-schema";
import z from "zod";

/**Creates a password reset session, and sends a password reset link to a user.*/
export const sendPasswordResetLinkHandler = createHandler(
  async (req: TRequest<z.infer<typeof emailPayloadSchema>>, res) => {
    const { email } = req.body;
    const [session] = await db(tablenames.passwordResetSessions)
      .insert({
        user_id: db.select("id").from(tablenames.users).where({ email }).limit(1),
        expires_at: new Date(Date.now() + 1000 * 60 * 15),
      })
      .returning("id");
    const token = createJWT(
      {
        session_id: session.id,
      },
      {
        expiresIn: "15min",
      },
    );
    const domain = loadEnvVariable("FRONT_END_URL");
    const emailHtml = `
			<html>
				<body>
					<h1>Reset Password</h1>
					<p>
						You have requested to reset your Pond password. If it wasn't you, please ignore this email.<br/> 
            Otherwise, please click the link below:
					</p>
					<a style="font-size=18px; font-weight=600" href="${domain}/reset-password?token=${token}">Reset your password.</a>
					<footer>
						<p>
							If it wasn't you who requested to reset your email, please ignore this message.
						</p>
					</footer>
				</body>
			</html>
		`;

    await services.emails.send({
      to: email,
      subject: "Reset Your Password",
      html: emailHtml,
    });
    return res.end();
  },
);
