/** Every public API route: handler path relative to the repo root and its HTTP API route key. */
export interface RouteDef {
  handler: string;
  routeKey: string;
}

export const allRoutes: RouteDef[] = [
  { handler: "apps/api/src/functions/contact/submit.handler", routeKey: "POST /api/contact" },
];

/**
 * Stable CDK construct id derived from the handler path. Frozen on purpose: a changed id makes
 * CloudFormation create the new route before deleting the old one and fail with
 * `ConflictException: route already exists`.
 */
export const routeLogicalId = (handler: string): string =>
  handler
    .replace(/^apps\/api\/src\/functions\//, "api/")
    .replace(/\.handler$/, "")
    .replace(/[^a-zA-Z0-9]+/g, "-");

/** Lambda `handler` string inside the shared bundle dir (`contact/submit.handler`). */
export const assetHandler = (handler: string): string =>
  handler.replace(/^apps\/api\/src\/functions\//, "");
