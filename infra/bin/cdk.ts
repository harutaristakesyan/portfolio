import { App, Tags } from "aws-cdk-lib";
import { SiteStack } from "../lib/site-stack.js";

// Everything in us-east-1: CloudFront needs its certificate there, and one region keeps the
// whole thing a single `cdk deploy`.
const env = { account: process.env.CDK_DEFAULT_ACCOUNT, region: "us-east-1" };

const app = new App();
new SiteStack(app, "portfolio", {
  env,
  source: "apps/web/dist",
  domain: process.env.DOMAIN || undefined,
  // harut.dev is a user alias domain of the Readymade Google Workspace (added 7 Nov 2026).
  mail:
    process.env.DOMAIN === "harut.dev"
      ? {
          siteVerification: "google-site-verification=mt6SPSOzRqUsCMFfYWUj3IfZjrdupK1oDzyrNz9nUQ0",
          dkimPublicKey: process.env.GOOGLE_DKIM_PUBLIC_KEY || undefined,
        }
      : undefined,
  contactTo: process.env.CONTACT_TO ?? "harut.aristakesyan@gmail.com",
  mailFrom: process.env.MAIL_FROM ?? "Portfolio <hello@readymade.works>",
  resendApiKey: process.env.RESEND_API_KEY ?? "",
});
Tags.of(app).add("Application", "portfolio");
