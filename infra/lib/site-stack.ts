import { readdirSync } from "node:fs";
import * as path from "node:path";
import { fileURLToPath } from "node:url";
import { CfnOutput, Duration, RemovalPolicy, Stack, type StackProps } from "aws-cdk-lib";
import {
  HttpApi,
  type HttpMethod,
  HttpRoute,
  HttpRouteKey,
  HttpStage,
} from "aws-cdk-lib/aws-apigatewayv2";
import { HttpLambdaIntegration } from "aws-cdk-lib/aws-apigatewayv2-integrations";
import * as acm from "aws-cdk-lib/aws-certificatemanager";
import * as cloudfront from "aws-cdk-lib/aws-cloudfront";
import * as origins from "aws-cdk-lib/aws-cloudfront-origins";
import * as lambda from "aws-cdk-lib/aws-lambda";
import * as logs from "aws-cdk-lib/aws-logs";
import * as route53 from "aws-cdk-lib/aws-route53";
import * as targets from "aws-cdk-lib/aws-route53-targets";
import * as s3 from "aws-cdk-lib/aws-s3";
import * as s3deploy from "aws-cdk-lib/aws-s3-deployment";
import * as ses from "aws-cdk-lib/aws-ses";
import type { Construct } from "constructs";
import { allRoutes, assetHandler, routeLogicalId } from "./routes.js";

const here = path.dirname(fileURLToPath(import.meta.url));
export const repoRoot = path.resolve(here, "..", "..");
/** One esbuild output (infra/.lambda) holding every handler; CDK uploads it once. */
export const BUNDLE_DIR = path.join(here, "..", ".lambda");

export interface SiteStackProps extends StackProps {
  /** Repo-relative build dir of the static site, e.g. `apps/web/dist`. */
  source: string;
  /** Apex domain with a Route 53 hosted zone in this account. */
  domain: string;
  /** Google Workspace records for the domain (user alias domain of the Readymade workspace). */
  mail: {
    /** `google-site-verification=…` token from the Admin console. */
    siteVerification: string;
    /** Public DKIM key (the `p=` value) generated in the Admin console. */
    dkimPublicKey: string;
  };
  /** Recipient of contact-form mail, an address on `domain`. */
  contactTo: string;
  /** Sender, e.g. `Portfolio <hello@example.com>`, an address on `domain`. */
  mailFrom: string;
}

/** Page routes present in the exact build being uploaded; the edge rejects anything else. */
export function staticHtmlPaths(source: string): string[] {
  const root = path.join(repoRoot, source);
  const visit = (directory: string): string[] =>
    readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
      const file = path.join(directory, entry.name);
      if (entry.isDirectory()) return visit(file);
      return entry.isFile() && entry.name.endsWith(".html")
        ? [`/${path.relative(root, file).split(path.sep).join("/")}`]
        : [];
    });
  return visit(root).sort();
}

/**
 * The whole site in one stack: private S3 bucket behind CloudFront with origin access control,
 * a CloudFront Function that maps clean URLs to `.html` objects, and an HTTP API with one
 * Lambda per route, reached through CloudFront on the same origin (so no CORS).
 */
export class SiteStack extends Stack {
  constructor(scope: Construct, id: string, props: SiteStackProps) {
    super(scope, id, props);
    const { domain, source } = props;

    // --- DNS + certificate ------------------------------------------------------
    const zone = route53.HostedZone.fromLookup(this, "Zone", { domainName: domain });
    const cert = new acm.Certificate(this, "Cert", {
      domainName: domain,
      subjectAlternativeNames: [`www.${domain}`],
      validation: acm.CertificateValidation.fromDns(zone),
    });

    // --- Outgoing mail (SES) ----------------------------------------------------
    // SES verifies the whole domain through Route 53 (Easy DKIM CNAMEs) with a custom MAIL FROM
    // subdomain, so DKIM and SPF both align for DMARC. Sender and recipient are both on the
    // domain, which covers them even in the SES sandbox.
    const mailIdentity = new ses.EmailIdentity(this, "MailDomain", {
      identity: ses.Identity.publicHostedZone(zone),
      mailFromDomain: `bounce.${domain}`,
    });

    // --- API: one Lambda per route ------------------------------------------
    const httpApi = new HttpApi(this, "HttpApi", { apiName: id, createDefaultStage: false });
    new HttpStage(this, "Stage", {
      httpApi,
      autoDeploy: true,
      // A personal contact form never needs more than this; it caps the mail volume on a bad day.
      throttle: { rateLimit: 5, burstLimit: 10 },
    });
    const environment = {
      CONTACT_TO: props.contactTo,
      MAIL_FROM: props.mailFrom,
    };
    for (const route of allRoutes) {
      const baseId = routeLogicalId(route.handler);
      const fn = new lambda.Function(this, baseId, {
        runtime: lambda.Runtime.NODEJS_24_X,
        architecture: lambda.Architecture.ARM_64,
        code: lambda.Code.fromAsset(BUNDLE_DIR),
        handler: assetHandler(route.handler),
        memorySize: 256,
        timeout: Duration.seconds(10),
        environment,
        logGroup: new logs.LogGroup(this, `${baseId}Logs`, {
          retention: logs.RetentionDays.ONE_MONTH,
          removalPolicy: RemovalPolicy.DESTROY,
        }),
      });
      mailIdentity.grantSendEmail(fn);
      const [method, routePath] = route.routeKey.split(" ") as [HttpMethod, string];
      new HttpRoute(this, `${baseId}-route`, {
        httpApi,
        routeKey: HttpRouteKey.with(routePath, method),
        integration: new HttpLambdaIntegration(`${baseId}-int`, fn),
      });
    }

    // --- Static site + CDN ----------------------------------------------------
    const bucket = new s3.Bucket(this, "Site", {
      blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
      enforceSSL: true,
      removalPolicy: RemovalPolicy.DESTROY,
      autoDeleteObjects: true,
    });

    const htmlPaths = staticHtmlPaths(source);
    const apiPaths = allRoutes.map((r) => r.routeKey.split(" ")[1]);
    const urlRewrite = new cloudfront.Function(this, "UrlRewrite", {
      runtime: cloudfront.FunctionRuntime.JS_2_0,
      code: cloudfront.FunctionCode.fromInline(`
        function handler(event) {
          var req = event.request;
          var uri = req.uri;
          var host = req.headers.host && req.headers.host.value;
          if (host === "www.${domain}") {
            return { statusCode: 301, statusDescription: "Moved Permanently", headers: { location: { value: "https://${domain}" + uri } } };
          }
          // Only declared API routes exist; everything else under /api is not a page.
          if (uri === "/api" || uri.indexOf("/api/") === 0) {
            return ${JSON.stringify(apiPaths)}.indexOf(uri) !== -1 ? req : { statusCode: 404, statusDescription: "Not Found" };
          }
          var htmlPaths = ${JSON.stringify(htmlPaths)};
          // Trailing slashes redirect to the canonical bare URL so search engines see one address.
          if (uri !== "/" && uri.endsWith("/")) {
            var bare = uri;
            while (bare.length > 1 && bare.charAt(bare.length - 1) === "/") bare = bare.slice(0, -1);
            if (htmlPaths.indexOf(bare + ".html") !== -1) {
              return { statusCode: 301, statusDescription: "Moved Permanently", headers: { location: { value: bare } } };
            }
          }
          if (uri === "/") req.uri = "/index.html";
          else if (uri.indexOf(".") === -1) req.uri = uri + ".html";
          // Unknown pages stay unknown: S3 answers 403 for a missing key and the distribution's
          // error response turns that into /404.html with a real 404 status.
          return req;
        }`),
    });

    const headers = new cloudfront.ResponseHeadersPolicy(this, "Headers", {
      securityHeadersBehavior: {
        contentSecurityPolicy: {
          override: true,
          contentSecurityPolicy: [
            "default-src 'self'",
            "script-src 'self'",
            "style-src 'self'",
            "img-src 'self' data:",
            "font-src 'self'",
            "connect-src 'self'",
            "form-action 'self'",
            "frame-ancestors 'none'",
            "base-uri 'self'",
            "object-src 'none'",
          ].join("; "),
        },
        contentTypeOptions: { override: true },
        frameOptions: { override: true, frameOption: cloudfront.HeadersFrameOption.DENY },
        referrerPolicy: {
          override: true,
          referrerPolicy: cloudfront.HeadersReferrerPolicy.STRICT_ORIGIN_WHEN_CROSS_ORIGIN,
        },
        strictTransportSecurity: {
          override: true,
          accessControlMaxAge: Duration.days(365),
          includeSubdomains: true,
          preload: true,
        },
      },
    });

    const apiOrigin = new origins.HttpOrigin(
      `${httpApi.apiId}.execute-api.${this.region}.amazonaws.com`,
    );
    const apiBehavior: cloudfront.BehaviorOptions = {
      origin: apiOrigin,
      viewerProtocolPolicy: cloudfront.ViewerProtocolPolicy.HTTPS_ONLY,
      allowedMethods: cloudfront.AllowedMethods.ALLOW_ALL,
      cachePolicy: cloudfront.CachePolicy.CACHING_DISABLED,
      originRequestPolicy: cloudfront.OriginRequestPolicy.ALL_VIEWER_EXCEPT_HOST_HEADER,
      responseHeadersPolicy: headers,
      functionAssociations: [
        { function: urlRewrite, eventType: cloudfront.FunctionEventType.VIEWER_REQUEST },
      ],
    };

    const dist = new cloudfront.Distribution(this, "Cdn", {
      domainNames: [domain, `www.${domain}`],
      certificate: cert,
      defaultRootObject: "index.html",
      minimumProtocolVersion: cloudfront.SecurityPolicyProtocol.TLS_V1_2_2021,
      httpVersion: cloudfront.HttpVersion.HTTP2_AND_3,
      priceClass: cloudfront.PriceClass.PRICE_CLASS_100,
      defaultBehavior: {
        origin: origins.S3BucketOrigin.withOriginAccessControl(bucket),
        viewerProtocolPolicy: cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
        allowedMethods: cloudfront.AllowedMethods.ALLOW_GET_HEAD,
        compress: true,
        responseHeadersPolicy: headers,
        functionAssociations: [
          { function: urlRewrite, eventType: cloudfront.FunctionEventType.VIEWER_REQUEST },
        ],
      },
      additionalBehaviors: Object.fromEntries(apiPaths.map((p) => [p, apiBehavior])),
      // A missing object is a 403 from S3 behind origin access control; both become the 404 page.
      errorResponses: [
        { httpStatus: 403, responseHttpStatus: 404, responsePagePath: "/404.html" },
        { httpStatus: 404, responseHttpStatus: 404, responsePagePath: "/404.html" },
      ],
    });

    // Uploads the exact build this stack was synthesised against and invalidates the CDN.
    new s3deploy.BucketDeployment(this, "Deploy", {
      sources: [s3deploy.Source.asset(path.join(repoRoot, source))],
      destinationBucket: bucket,
      distribution: dist,
      distributionPaths: ["/*"],
      prune: true,
    });

    // --- Records --------------------------------------------------------------
    const target = route53.RecordTarget.fromAlias(new targets.CloudFrontTarget(dist));
    new route53.ARecord(this, "Apex", { zone, target });
    new route53.AaaaRecord(this, "ApexV6", { zone, target });
    new route53.ARecord(this, "Www", { zone, recordName: "www", target });
    new route53.AaaaRecord(this, "WwwV6", { zone, recordName: "www", target });
    const ttl = Duration.seconds(300);
    // One apex TXT set carries both the Workspace verification and SPF: Route 53 allows a
    // single TXT record set per name, so they must live together.
    new route53.TxtRecord(this, "ApexTxt", {
      zone,
      values: [props.mail.siteVerification, "v=spf1 include:_spf.google.com ~all"],
      ttl,
    });
    new route53.MxRecord(this, "GoogleWorkspaceMail", {
      zone,
      values: [{ priority: 1, hostName: "smtp.google.com" }],
      ttl,
    });
    new route53.TxtRecord(this, "GoogleWorkspaceDkim", {
      zone,
      recordName: "google._domainkey",
      values: [`v=DKIM1;k=rsa;p=${props.mail.dkimPublicKey}`],
      ttl,
    });
    // Monitoring only until every legitimate sender is confirmed.
    new route53.TxtRecord(this, "MailDmarc", {
      zone,
      recordName: "_dmarc",
      values: ["v=DMARC1; p=none; adkim=r; aspf=r"],
      ttl,
    });

    new CfnOutput(this, "SiteUrl", { value: `https://${domain}` });
    new CfnOutput(this, "CloudFrontDomain", { value: dist.distributionDomainName });
    new CfnOutput(this, "ApiUrl", { value: httpApi.apiEndpoint });
  }
}
