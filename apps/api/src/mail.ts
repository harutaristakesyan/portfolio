import { Resend } from "resend";
import type { ContactSubmit } from "./contracts.js";

let client: Resend | undefined;
const resend = () => {
  client ??= new Resend(process.env.RESEND_API_KEY);
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
  // Tests and local runs: write to the log instead of Resend. Never set in Lambda.
  if (process.env.MAIL_TRANSPORT === "log") {
    console.log(`[mail sink] to=${input.to} subject=${input.subject}\n${input.text}`);
    return;
  }
  const from = process.env.MAIL_FROM;
  if (!from) throw new Error("MAIL_FROM is not set");
  const { error } = await resend().emails.send({ from, ...input });
  if (error) throw new Error(`resend: ${error.name} ${error.message}`);
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
