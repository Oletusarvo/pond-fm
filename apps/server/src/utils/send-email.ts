import { loadEnvVariable } from './load-env-variable';

require('dotenv').config();
/**Sends an email using the configured transport-object in the nodemailer.config file.
 * @deprecated
 */
export async function sendEmail({
  to,
  subject,
  html,
}: {
  to: string;
  subject: string;
  html: string;
}) {
  const serviceEmail = loadEnvVariable('SERVICE_EMAIL', true);
  const body = JSON.stringify({
    sender: { email: serviceEmail, name: 'E-MRK' },
    to: [{ email: to }],
    subject,
    htmlContent: html,
  });
  const apiKey = loadEnvVariable('EMAIL_API_KEY');

  const res = await fetch(
    'https://api.brevo.com/v3/smtp/email',

    {
      method: 'POST',
      body,
      headers: {
        'api-key': apiKey.trim(),
        'Content-Type': 'application/json',
      },
    },
  );

  console.log(res.status, res.statusText);
  return res;
}
