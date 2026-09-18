import { loadEnvVariable } from "@pondfm/server-utils";
import { getDomainUrl } from "../utils/get-domain-url";
import { appName } from "@pondfm/app-shared";
import { readFile } from "fs/promises";
import path from "path";

/**Responsible for sending emails. */
export class EmailService {
  constructor(
    private endpoint: string,
    private apiKey: string,
  ) {}

  async sendMagicLink(to: string, code: string) {
    const domainUrl = getDomainUrl();
    const templateSource = await readFile(
      path.join(process.cwd(), "./src/html-templates/magic-link-template.html"),
      {
        encoding: "utf-8",
      },
    );
    const template = Handlebars.template(templateSource);
    const html = template({
      appName: "Amphitune",
      code,
      url: `${domainUrl}/authorize?code=${code}`,
    });

    return this.send({
      to,
      subject: `Log in to ${appName}`,
      html,
    });
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
  loadEnvVariable("EMAIL_API_KEY"),
);
