import { App } from "aws-cdk-lib";
import { Match, Template } from "aws-cdk-lib/assertions";
import { describe, expect, it } from "vitest";
import { GithubOidcStack } from "../lib/github-oidc-stack.js";
import { SiteStack, staticHtmlPaths } from "../lib/site-stack.js";

const source = "infra/test/fixtures/dist";
const account = "123456789012";
const base = { contactTo: "me@example.com", mailFrom: "Me <me@example.com>", resendApiKey: "re_x" };

const synth = (domain?: string, mail?: { siteVerification: string; dkimPublicKey?: string }) => {
  const app = new App({
    context: {
      [`hosted-zone:account=${account}:domainName=example.com:region=us-east-1`]: {
        Id: "/hostedzone/Z123",
        Name: "example.com.",
      },
    },
  });
  const stack = new SiteStack(app, "portfolio", {
    env: { account, region: "us-east-1" },
    source,
    domain,
    mail,
    ...base,
  });
  return Template.fromStack(stack);
};

describe("staticHtmlPaths", () => {
  it("lists every html file in the build, sorted, as absolute paths", () => {
    expect(staticHtmlPaths(source)).toEqual(["/404.html", "/index.html", "/work/case.html"]);
  });
});

describe("SiteStack without a domain", () => {
  const t = synth();

  it("keeps the bucket private behind origin access control", () => {
    t.hasResourceProperties("AWS::S3::Bucket", {
      PublicAccessBlockConfiguration: { BlockPublicAcls: true, RestrictPublicBuckets: true },
    });
    t.resourceCountIs("AWS::CloudFront::OriginAccessControl", 1);
    t.hasResourceProperties("AWS::S3::BucketPolicy", {
      PolicyDocument: {
        Statement: Match.arrayWith([
          Match.objectLike({
            Effect: "Deny",
            Condition: { Bool: { "aws:SecureTransport": "false" } },
          }),
        ]),
      },
    });
  });

  it("serves the site with https, http/3 and security headers, no custom domain", () => {
    t.hasResourceProperties("AWS::CloudFront::Distribution", {
      DistributionConfig: Match.objectLike({
        Aliases: Match.absent(),
        HttpVersion: "http2and3",
        DefaultRootObject: "index.html",
        DefaultCacheBehavior: Match.objectLike({
          ViewerProtocolPolicy: "redirect-to-https",
          Compress: true,
          AllowedMethods: ["GET", "HEAD"],
        }),
        CustomErrorResponses: Match.arrayWith([
          Match.objectLike({ ErrorCode: 403, ResponseCode: 404, ResponsePagePath: "/404.html" }),
        ]),
      }),
    });
    t.hasResourceProperties("AWS::CloudFront::ResponseHeadersPolicy", {
      ResponseHeadersPolicyConfig: Match.objectLike({
        SecurityHeadersConfig: Match.objectLike({
          StrictTransportSecurity: Match.objectLike({ Preload: true, IncludeSubdomains: true }),
          FrameOptions: { FrameOption: "DENY", Override: true },
          ContentSecurityPolicy: Match.objectLike({
            ContentSecurityPolicy: Match.stringLikeRegexp("frame-ancestors 'none'"),
          }),
        }),
      }),
    });
    t.resourceCountIs("AWS::CertificateManager::Certificate", 0);
    t.resourceCountIs("AWS::Route53::RecordSet", 0);
  });

  it("maps clean URLs to html objects and rejects unknown pages at the edge", () => {
    const fns = t.findResources("AWS::CloudFront::Function");
    const code = String(Object.values(fns)[0]?.Properties.FunctionCode);
    expect(code).toContain('"/work/case.html"');
    expect(code).not.toContain('req.uri = "/404.html"');
    expect(code).toContain('"/api/contact"');
    expect(code).not.toContain("www.");
  });

  it("routes only POST /api/contact to a Node 22 ARM Lambda and throttles the API", () => {
    t.hasResourceProperties("AWS::Lambda::Function", {
      Runtime: "nodejs22.x",
      Architectures: ["arm64"],
      Handler: "contact/submit.handler",
      Environment: {
        Variables: { CONTACT_TO: "me@example.com", MAIL_FROM: "Me <me@example.com>" },
      },
    });
    t.resourceCountIs("AWS::Lambda::Function", 1 + 2); // + bucket auto-delete and bucket deployment providers
    t.hasResourceProperties("AWS::ApiGatewayV2::Route", { RouteKey: "POST /api/contact" });
    t.resourceCountIs("AWS::ApiGatewayV2::Route", 1);
    t.hasResourceProperties("AWS::ApiGatewayV2::Stage", {
      StageName: "$default",
      AutoDeploy: true,
      DefaultRouteSettings: { ThrottlingRateLimit: 5, ThrottlingBurstLimit: 10 },
    });
    t.hasResourceProperties("AWS::CloudFront::Distribution", {
      DistributionConfig: Match.objectLike({
        CacheBehaviors: [
          Match.objectLike({ PathPattern: "/api/contact", ViewerProtocolPolicy: "https-only" }),
        ],
      }),
    });
    t.hasResourceProperties("AWS::Logs::LogGroup", { RetentionInDays: 30 });
  });

  it("uploads the build and invalidates the whole distribution", () => {
    t.hasResourceProperties("Custom::CDKBucketDeployment", {
      Prune: true,
      DistributionPaths: ["/*"],
    });
  });
});

describe("SiteStack with a domain", () => {
  const t = synth("example.com");

  it("adds a DNS-validated certificate, aliases and apex + www records", () => {
    t.hasResourceProperties("AWS::CertificateManager::Certificate", {
      DomainName: "example.com",
      SubjectAlternativeNames: ["www.example.com"],
      ValidationMethod: "DNS",
    });
    t.hasResourceProperties("AWS::CloudFront::Distribution", {
      DistributionConfig: Match.objectLike({ Aliases: ["example.com", "www.example.com"] }),
    });
    t.resourceCountIs("AWS::Route53::RecordSet", 4);
    t.hasResourceProperties("AWS::Route53::RecordSet", { Name: "www.example.com.", Type: "AAAA" });
  });

  it("redirects www to the apex at the edge", () => {
    const fns = t.findResources("AWS::CloudFront::Function");
    const code = String(Object.values(fns)[0]?.Properties.FunctionCode);
    expect(code).toContain('host === "www.example.com"');
    expect(code).toContain('"https://example.com" + uri');
  });
});

describe("SiteStack with Google Workspace mail", () => {
  it("adds MX, one apex TXT with verification + SPF, DMARC, and DKIM only when the key is known", () => {
    const t = synth("example.com", { siteVerification: "google-site-verification=abc" });
    t.hasResourceProperties("AWS::Route53::RecordSet", {
      Name: "example.com.",
      Type: "MX",
      ResourceRecords: ["1 smtp.google.com"],
    });
    t.hasResourceProperties("AWS::Route53::RecordSet", {
      Name: "example.com.",
      Type: "TXT",
      ResourceRecords: ['"google-site-verification=abc"', '"v=spf1 include:_spf.google.com ~all"'],
    });
    t.hasResourceProperties("AWS::Route53::RecordSet", {
      Name: "_dmarc.example.com.",
      Type: "TXT",
    });
    t.resourceCountIs("AWS::Route53::RecordSet", 4 + 3);

    const withDkim = synth("example.com", { siteVerification: "x", dkimPublicKey: "MIIB" });
    withDkim.hasResourceProperties("AWS::Route53::RecordSet", {
      Name: "google._domainkey.example.com.",
      Type: "TXT",
      ResourceRecords: ['"v=DKIM1;k=rsa;p=MIIB"'],
    });
  });

  it("adds no mail records without a domain", () => {
    const t = synth(undefined, { siteVerification: "x" });
    t.resourceCountIs("AWS::Route53::RecordSet", 0);
  });
});

describe("GithubOidcStack", () => {
  it("trusts only the prod environment of this repository and only assumes CDK roles", () => {
    const app = new App();
    const stack = new GithubOidcStack(app, "oidc", {
      env: { account, region: "us-east-1" },
      subjectPrefixes: ["repo:harutaristakesyan/portfolio", "repo:harutaristakesyan@1/portfolio@2"],
      environment: "prod",
      roleName: "portfolio-github-deploy-role",
    });
    const t = Template.fromStack(stack);
    t.hasResourceProperties("AWS::IAM::Role", {
      RoleName: "portfolio-github-deploy-role",
      AssumeRolePolicyDocument: {
        Statement: [
          Match.objectLike({
            Action: "sts:AssumeRoleWithWebIdentity",
            Condition: {
              StringEquals: {
                "token.actions.githubusercontent.com:aud": "sts.amazonaws.com",
                "token.actions.githubusercontent.com:sub": [
                  "repo:harutaristakesyan/portfolio:environment:prod",
                  "repo:harutaristakesyan@1/portfolio@2:environment:prod",
                ],
              },
            },
          }),
        ],
      },
    });
    t.hasResourceProperties("AWS::IAM::Policy", {
      PolicyDocument: {
        Statement: [
          {
            Action: "sts:AssumeRole",
            Effect: "Allow",
            Resource: `arn:aws:iam::${account}:role/cdk-*`,
          },
        ],
      },
    });
    t.resourceCountIs("AWS::IAM::OIDCProvider", 0);
  });
});
