import { SESv2Client, SendEmailCommand } from "@aws-sdk/client-sesv2";
import type { ContactSubmit } from "./functions/contact/schema.js";

// Credentials come from the Lambda role; the SDK ships with the Node 24 runtime.
let client: SESv2Client | undefined;
const ses = () => {
  client ??= new SESv2Client({});
  return client;
};

export const esc = (s: string) =>
  s.replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c] ?? c);

export interface SendMailInput {
  to: string;
  subject: string;
  html: string;
  text: string;
  replyTo?: string;
}

export async function sendMail(input: SendMailInput): Promise<void> {
  // Tests and local runs: write to the log instead of SES. Never set in Lambda.
  if (process.env.MAIL_TRANSPORT === "log") {
    console.log(`[mail sink] to=${input.to} subject=${input.subject}\n${input.text}`);
    return;
  }
  const from = process.env.MAIL_FROM;
  if (!from) throw new Error("MAIL_FROM is not set");
  const utf8 = (Data: string) => ({ Data, Charset: "UTF-8" });
  await ses().send(
    new SendEmailCommand({
      FromEmailAddress: from,
      Destination: { ToAddresses: [input.to] },
      ReplyToAddresses: input.replyTo ? [input.replyTo] : undefined,
      Content: {
        Simple: {
          Subject: utf8(input.subject),
          Body: { Html: utf8(input.html), Text: utf8(input.text) },
        },
      },
    }),
  );
}

export const contactNotification = (
  to: string,
  lead: Omit<ContactSubmit, "website">,
): SendMailInput => ({
  to,
  replyTo: lead.email,
  subject: `[portfolio] ${lead.name}`,
  html: `<p><b>${esc(lead.name)} &lt;${esc(lead.email)}&gt;</b></p><pre style="font:14px/1.5 sans-serif;white-space:pre-wrap">${esc(lead.message)}</pre>`,
  text: `${lead.name} <${lead.email}>\n\n${lead.message}`,
});
