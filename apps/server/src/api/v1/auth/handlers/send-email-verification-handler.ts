import { createHandler, createJWT, loadEnvVariable } from "@pondfm/server-utils";
import { TRequest } from "../../../../types/request";
import { services } from "../../../../container";
import { emailPayloadSchema } from "../../../../schemas/email-payload-schema";
import z from "zod";

export const sendEmailVerificationLinkHandler = createHandler(
  async (req: TRequest<z.infer<typeof emailPayloadSchema>>, res) => {
    const { email } = req.body;
    const token = createJWT(
      {
        email,
      },
      {
        expiresIn: "30min",
      },
    );
    const domain = loadEnvVariable("FRONT_END_URL");
    const emailHtml = `
      <html>
        <body>
          <h1>Verify Your Email</h1>
          <p>
            Hello there!<br/>
            You have requested to register at Pond.fm. Please click the link below to continue the login process.
          </p> 
          <a href="${domain}/register/complete?token=${token}>Continue your registration process.</a> 
          <p>If you didn't request to register with us, please ignore this message.</p>
        </body>
      </html>
    `;
    await services.emails.send({
      to: email,
      subject: "Verify Your Email",
      html: emailHtml,
    });
    return res.end();
  },
);
