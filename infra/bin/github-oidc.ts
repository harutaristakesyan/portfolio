import { App, Tags } from "aws-cdk-lib";
import { GithubOidcStack } from "../lib/github-oidc-stack.js";

// Bootstraps GitHub access independently of the site and its Route 53 lookups.
const app = new App();
new GithubOidcStack(app, "portfolio-github-oidc", {
  env: { account: process.env.CDK_DEFAULT_ACCOUNT, region: "us-east-1" },
  // Repository 959312172 owned by 60658782 (public GitHub API, 7 Nov 2026).
  subjectPrefixes: [
    "repo:harutaristakesyan/portfolio",
    "repo:harutaristakesyan@60658782/portfolio@959312172",
  ],
  environment: "prod",
  roleName: "portfolio-github-deploy-role",
});
Tags.of(app).add("Application", "portfolio");
