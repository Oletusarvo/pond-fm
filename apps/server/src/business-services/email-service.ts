import { createJWT, loadEnvVariable } from "@pondfm/server-utils";
import { getDomainUrl } from "../utils/get-domain-url";
import { appName } from "@pondfm/app-shared";
import Handlebars from "handlebars";
import { applyInlineCss, loadTemplateSource } from "../handlebars.config";

/**Responsible for sending emails. */
export class EmailService {
  constructor(
    private endpoint: string,
    private apiKey: string,
  ) {}

  private async runIfInProduction(fn: () => Promise<void>, onNotProductionEnvironment: () => void) {
    if (process.env.AUTH_ENVIRONMENT === "production") {
      await fn();
    } else {
      onNotProductionEnvironment();
    }
  }

  async sendEmailVerificationLink(email: string, userId: string) {
    const token = createJWT(
      {
        user_id: userId,
      },
      {
        expiresIn: "10min",
      },
    );
    await this.runIfInProduction(
      async () => {
        const domain = getDomainUrl();
        //Send the verification email
        const templateSource = await loadTemplateSource(
          "./src/html-templates/verify-email-template.html",
        );
        const template = Handlebars.compile(templateSource);
        const templateConfig = await applyInlineCss({
          url: `${domain}/verify?token=${token}`,
        });
        const html = template(templateConfig);
        await this.send({
          to: email,
          subject: "Verify Your Email",
          html,
        });
      },
      () => console.log(`Email verification token: ` + token),
    );
  }

  async sendMagicLink(to: string, code: string) {
    await this.runIfInProduction(
      async () => {
        const domainUrl = getDomainUrl();
        const templateSource = await loadTemplateSource(
          "./src/html-templates/magic-link-template.html",
        );
        const template = Handlebars.compile(templateSource);
        const templateConfig = await applyInlineCss({
          appName: "Amphitune",
          code,
          url: `${domainUrl}/login?step=authorize&code=${code}`,
        });

        const html = template(templateConfig);
        await this.send({
          to,
          subject: `Log in to ${appName}`,
          html,
        });
      },
      () => console.log("Authorization code: ", code),
    );
  }

  async sendEmailResetLink(to: string, sessionId: string) {
    const token = createJWT({ session_id: sessionId }, { expiresIn: "30min" });
    await this.runIfInProduction(
      async () => {
        const templateSource = await loadTemplateSource("reset-email-template.hmtl");
        const template = Handlebars.compile(templateSource);
        const frontEndDomain = getDomainUrl();
        const templateConfig = await applyInlineCss({
          url: `${frontEndDomain}/verify-email-reset?token=${token}`,
        });
        const html = template(templateConfig);
        await this.send({ to, subject: "Reset your Amphitune email", html });
      },
      () => console.log("Email reset token: ", token),
    );
  }

  async send({ to, subject, html }: { to: string; subject: string; html: string }) {
    const serviceEmail = loadEnvVariable("SERVICE_EMAIL", true);
    const body = JSON.stringify({
      sender: { email: serviceEmail, name: appName },
      to: [{ email: to }],
      subject,
      htmlContent: html,
    });

    const res = await fetch(
      this.endpoint,

      {
        method: "POST",
        body,
        headers: {
          "api-key": this.apiKey.trim(),
          "Content-Type": "application/json",
        },
      },
    );

    return res;
  }

  createEmailHtml({ title, body }: { title: string; body: string }) {
    return `
      <html>
        <style>
          h1{
            font-size: 24px;
            font-weight: 600;
          }

          .body-text{
            font-size: 18px;
            color: #0008;
          }
        </style>
        <h1>${title}</h1>
        <p class="body-text">
          ${body}
        </p>
        <i>With regards, the ${appName} Team.</i>
      </html>
    `;
  }
}

export const emailService = new EmailService(
  "https://api.brevo.com/v3/smtp/email",
  loadEnvVariable("EMAIL_API_KEY", false),
);
