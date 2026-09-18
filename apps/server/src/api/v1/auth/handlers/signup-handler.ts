import z from "zod";
import { TRequest } from "../../../../types/request";
import { createHandler, createJWT, loadEnvVariable } from "@pondfm/server-utils";
import { signupSchema } from "../../../../schemas/signup-schema";
import { db } from "../../../../db-config";
import { tablenames } from "../../../../tablenames";
import { services } from "../../../../container";
import { readFile } from "fs/promises";
import path from "path";
import Handlebars from "handlebars";

export const signupHandler = createHandler(
  async (req: TRequest<z.infer<typeof signupSchema>>, res) => {
    const { email, username } = req.body;
    await db.transaction(async (trx) => {
      const [user] = await trx(tablenames.users)
        .insert({
          email,
          username,
          terms_accepted_at: new Date(),
          status: "pending_verification",
        })
        .returning("id");

      await trx(tablenames.subscriptions).insert({
        plan_id: "free",
        user_id: user.id,
      });
      const token = createJWT(
        {
          user_id: user.id,
        },
        {
          expiresIn: "10min",
        },
      );
      if (process.env.AUTH_ENVIRONMENT === "production") {
        const domain = loadEnvVariable("FRONT_END_URL");
        //Send the verification email
        const htmlFile = await readFile(
          path.join(process.cwd(), "./src/html-templates/verify-email-template.html"),
          {
            encoding: "utf-8",
          },
        );
        const template = Handlebars.template(htmlFile);
        const html = template({
          url: `${domain}/verify?token=${token}`,
        });
        await services.emails.send({
          to: email,
          subject: "Verify Your Email",
          html,
        });
      } else {
        console.log(`Email verification token: ` + token);
      }
    });

    return res.end();
  },
  (err, res) => {
    const msg = err.message.toUpperCase();
    if (msg.includes("DUPLICATE")) {
      if (msg.includes("EMAIL_UNIQUE")) {
        return res.status(409).json({
          error: "auth:duplicate-email",
        });
      } else if (msg.includes("USERNAME_UNIQUE")) {
        return res.status(409).json({
          error: "auth:duplicate-username",
        });
      }
    }
  },
);
