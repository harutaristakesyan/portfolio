import type { APIGatewayProxyEventV2, APIGatewayProxyResultV2 } from "aws-lambda";
import type { ZodType, z } from "zod";

export type Event = APIGatewayProxyEventV2;
export type Result = APIGatewayProxyResultV2;

export class HttpError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message);
  }
}
export const badRequest = (m = "bad request") => new HttpError(400, m);

const JSON_HEADERS = { "content-type": "application/json; charset=utf-8" };

export const ok = (body: unknown, status = 200): Result => ({
  statusCode: status,
  headers: JSON_HEADERS,
  body: JSON.stringify(body),
});

const rawBody = (event: Event): string =>
  event.isBase64Encoded
    ? Buffer.from(event.body ?? "", "base64").toString("utf8")
    : (event.body ?? "");

export const parseBody = <S extends ZodType>(event: Event, schema: S): z.infer<S> => {
  let json: unknown;
  try {
    json = JSON.parse(rawBody(event) || "{}");
  } catch {
    throw badRequest("invalid json");
  }
  const parsed = schema.safeParse(json);
  if (!parsed.success) throw badRequest("validation");
  return parsed.data;
};

/** Wraps a handler: HttpError → its status, anything else → 500 with a log line. */
export const handle =
  (fn: (event: Event) => Promise<Result>) =>
  async (event: Event): Promise<Result> => {
    try {
      return await fn(event);
    } catch (err) {
      if (err instanceof HttpError) return ok({ error: err.message }, err.status);
      console.error(err);
      return ok({ error: "internal" }, 500);
    }
  };
