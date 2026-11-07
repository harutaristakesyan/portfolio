import { App, Tags } from "aws-cdk-lib";
import { SiteStack } from "../lib/site-stack.js";

// Everything in us-east-1: CloudFront needs its certificate there, and one region keeps the
// whole thing a single `cdk deploy`.
const env = { account: process.env.CDK_DEFAULT_ACCOUNT, region: "us-east-1" };

// The site's apex domain. Fixed in code, not configuration: its hosted zone is in this account.
// Keep in sync with `site` in apps/web/astro.config.ts.
const domain = "harut.dev";

const app = new App();
new SiteStack(app, "portfolio", {
  env,
  source: "apps/web/dist",
  domain,
  // harut.dev is a user alias domain of the Readymade Google Workspace (added 7 Nov 2026).
  mail: {
    siteVerification: "google-site-verification=mt6SPSOzRqUsCMFfYWUj3IfZjrdupK1oDzyrNz9nUQ0",
    // Public 2048-bit DKIM key generated in the Admin console on 7 Nov 2026; the private key stays
    // with Google. The fallback keeps the live record when the GitHub variable is unset.
    dkimPublicKey:
      process.env.GOOGLE_DKIM_PUBLIC_KEY ||
      "MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAmiITj9eTDMSZ/BJCOeu+MuyMAXxokq6++KvWaAl4yDatp2h4fn/LfU+Zsj2jRZWpWmmddc1it3Bg56P+lyw9A3LvDEJX7+nrbl5juzR87isBwUL8q+EVDM88aKy4Vigy81id4cMJHhV7yagu7CVUH/ByxrNZ+5805EQ+nUhcDiEuoBHhDjRZU0ubaAWXId6kGkvBolIFfBjDg5/vUfML6j8UMugCW4HeYo0p9c64h2janVEcjGM+mOgWkMXL5sa+RnF6CGGgIlJtebBjhTRcC5GDq8FG2XxQfhJJOr+KSy1rZE/cGH0+9w72E7hpBcTv0Wub07SOvCZPN7MkIiBHKQIDAQAB",
  },
  // Fixed in code, not configuration. Both are on the SES-verified domain, so no extra identity
  // or verification email is needed, even in the SES sandbox.
  contactTo: `aristakesyan@${domain}`,
  mailFrom: `Portfolio <hello@${domain}>`,
});
Tags.of(app).add("Application", "portfolio");
