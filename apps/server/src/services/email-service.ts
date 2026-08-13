import { getDomainUrl } from '../utils/get-domain-url';
import { loadEnvVariable } from '../utils/load-env-variable';

/**Responsible for sending emails. */
class EmailService {
  constructor(
    private endpoint: string,
    private apiKey: string,
  ) { }

  sendMagicLink(to: string, code: string) {
    const domainUrl = getDomainUrl();
    const html = this.createEmailHtml({
      title: 'Greetings!',
      body: `You have requested to log into Pond.Fm<br/>If that wasn't you, please ignore this message.<br/>
              Otherwise please tap <a href="${domainUrl}/authorize/${code}">this link</a>.`,
    });
    return this.send({
      to,
      subject: 'Log in to Pond.FM',
      html,
    });
  }

  async send({ to, subject, html }: { to: string; subject: string; html: string }) {
    const serviceEmail = loadEnvVariable('SERVICE_EMAIL', true);
    const body = JSON.stringify({
      sender: { email: serviceEmail, name: 'Pond.fm' },
      to: [{ email: to }],
      subject,
      htmlContent: html,
    });

    const res = await fetch(
      this.endpoint,

      {
        method: 'POST',
        body,
        headers: {
          'api-key': this.apiKey.trim(),
          'Content-Type': 'application/json',
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
        <i>With regards, the Pond.fm Team.</i>
      </html>
    `;
  }
}

export const emailService = new EmailService(
  'https://api.brevo.com/v3/smtp/email',
  loadEnvVariable('EMAIL_API_KEY'),
);
