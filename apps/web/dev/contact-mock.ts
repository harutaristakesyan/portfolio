import type { AstroIntegration } from "astro";

/**
 * `astro dev` only: answers POST /api/contact locally so the form can be tried without
 * deploying. Production traffic goes to the Lambda behind CloudFront; this never runs there.
 */
export const contactMock = (): AstroIntegration => ({
  name: "contact-mock",
  hooks: {
    "astro:server:setup": ({ server }) => {
      server.middlewares.use("/api/contact", (req, res) => {
        if (req.method !== "POST") {
          res.statusCode = 405;
          res.end();
          return;
        }
        let body = "";
        req.on("data", (chunk: Buffer) => {
          body += chunk.toString();
        });
        req.on("end", () => {
          console.log(`[contact mock] ${body}`);
          res.setHeader("content-type", "application/json");
          res.end(JSON.stringify({ ok: true }));
        });
      });
    },
  },
});
