import { CfnOutput, Duration, Stack, type StackProps } from "aws-cdk-lib";
import * as iam from "aws-cdk-lib/aws-iam";
import type { Construct } from "constructs";

export interface GithubOidcStackProps extends StackProps {
  /**
   * Accepted `sub` prefixes: the default `repo:<owner>/<repo>` and the form with ids
   * (`repo:<owner>@<id>/<repo>@<id>`) GitHub uses when "include ids" is enabled on the account.
   */
  subjectPrefixes: string[];
  /** GitHub Actions environment used by the deployment job. */
  environment: string;
  roleName: string;
}

/**
 * Lets GitHub Actions in this repository's `prod` environment assume a deploy role via OIDC,
 * so no long-lived AWS keys live in GitHub. The role only assumes the CDK bootstrap roles; those
 * carry the actual permissions. Deployed once, by hand: `pnpm --filter @portfolio/infra deploy:oidc`.
 */
export class GithubOidcStack extends Stack {
  constructor(scope: Construct, id: string, props: GithubOidcStackProps) {
    super(scope, id, props);

    // The GitHub provider exists at account scope and is shared by repositories (readymade created it).
    const provider = iam.OpenIdConnectProvider.fromOpenIdConnectProviderArn(
      this,
      "GithubProvider",
      `arn:${this.partition}:iam::${this.account}:oidc-provider/token.actions.githubusercontent.com`,
    );

    const role = new iam.Role(this, "DeployRole", {
      roleName: props.roleName,
      maxSessionDuration: Duration.hours(1),
      assumedBy: new iam.WebIdentityPrincipal(provider.openIdConnectProviderArn, {
        StringEquals: {
          "token.actions.githubusercontent.com:aud": "sts.amazonaws.com",
          "token.actions.githubusercontent.com:sub": props.subjectPrefixes.map(
            (prefix) => `${prefix}:environment:${props.environment}`,
          ),
        },
      }),
    });
    role.addToPolicy(
      new iam.PolicyStatement({
        actions: ["sts:AssumeRole"],
        resources: [`arn:aws:iam::${this.account}:role/cdk-*`],
      }),
    );

    new CfnOutput(this, "RoleArn", { value: role.roleArn });
  }
}
