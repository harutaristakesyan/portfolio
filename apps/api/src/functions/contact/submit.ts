import { ContactSubmit } from "../../contracts.js";
import { handle, ok, parseBody } from "../../http.js";
import { contactNotification, sendMail } from "../../mail.js";

/**
 * POST /api/contact. Validates, drops honeypot hits silently, and emails the message.
 * No storage: the email is the record, and Resend keeps its own delivery log.
 */
export const handler = handle(async (event) => {
  const { website, ...lead } = parseBody(event, ContactSubmit);
  if (website) return ok({ ok: true });
  const to = process.env.CONTACT_TO;
  if (!to) throw new Error("CONTACT_TO is not set");
  await sendMail(contactNotification(to, lead));
  return ok({ ok: true });
});
