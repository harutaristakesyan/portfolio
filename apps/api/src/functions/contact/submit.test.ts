import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("../../mail.js", async (importOriginal) => {
  const actual = await importOriginal<typeof import("../../mail.js")>();
  return { ...actual, sendMail: vi.fn(async () => undefined) };
});

import type { Event } from "../../http.js";
import { sendMail } from "../../mail.js";
import { handler } from "./submit.js";

const event = (body: unknown, base64 = false): Event =>
  ({
    body: base64 ? Buffer.from(JSON.stringify(body)).toString("base64") : JSON.stringify(body),
    isBase64Encoded: base64,
    headers: {},
  }) as unknown as Event;

const valid = { name: "Ada", email: "ada@example.com", message: "Hello" };

describe("POST /api/contact", () => {
  beforeEach(() => {
    vi.mocked(sendMail).mockClear();
    process.env.CONTACT_TO = "me@example.com";
  });

  it("emails a valid submission and replies ok", async () => {
    const res = await handler(event(valid));
    expect(res).toMatchObject({ statusCode: 200 });
    expect(sendMail).toHaveBeenCalledOnce();
    const mail = vi.mocked(sendMail).mock.calls[0]?.[0];
    expect(mail).toMatchObject({ to: "me@example.com", replyTo: "ada@example.com" });
    expect(mail?.subject).toContain("Ada");
    expect(mail?.text).toContain("Hello");
  });

  it("accepts base64-encoded bodies from API Gateway", async () => {
    const res = await handler(event(valid, true));
    expect(res).toMatchObject({ statusCode: 200 });
    expect(sendMail).toHaveBeenCalledOnce();
  });

  it("drops honeypot hits without sending, but still says ok", async () => {
    const res = await handler(event({ ...valid, website: "http://spam.example" }));
    expect(res).toMatchObject({ statusCode: 200 });
    expect(sendMail).not.toHaveBeenCalled();
  });

  it("rejects invalid payloads with 400 and sends nothing", async () => {
    for (const bad of [{}, { ...valid, email: "nope" }, { ...valid, message: "" }]) {
      const res = await handler(event(bad));
      expect(res).toMatchObject({ statusCode: 400 });
    }
    expect(sendMail).not.toHaveBeenCalled();
  });

  it("rejects malformed JSON with 400", async () => {
    const res = await handler({
      body: "{",
      isBase64Encoded: false,
      headers: {},
    } as unknown as Event);
    expect(res).toMatchObject({ statusCode: 400 });
  });

  it("escapes HTML in the notification", async () => {
    await handler(event({ ...valid, name: "<b>x</b>", message: "a < b" }));
    const mail = vi.mocked(sendMail).mock.calls[0]?.[0];
    expect(mail?.html).toContain("&lt;b&gt;x&lt;/b&gt;");
    expect(mail?.html).toContain("a &lt; b");
  });

  it("returns 500 when mail fails, without leaking the reason", async () => {
    vi.mocked(sendMail).mockRejectedValueOnce(new Error("ses: boom"));
    const spy = vi.spyOn(console, "error").mockImplementation(() => undefined);
    const res = await handler(event(valid));
    expect(res).toMatchObject({ statusCode: 500, body: JSON.stringify({ error: "internal" }) });
    spy.mockRestore();
  });
});
