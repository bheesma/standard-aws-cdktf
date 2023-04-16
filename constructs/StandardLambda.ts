import { Construct } from "constructs";
import { LambdaFunction } from "@cdktf/provider-aws/lib/lambda-function";
import { IamRole } from "@cdktf/provider-aws/lib/iam-role";
import { IamRolePolicyAttachment } from "@cdktf/provider-aws/lib/iam-role-policy-attachment";
import * as path from 'path';
import * as fs from 'fs';
import { AssetType, TerraformAsset } from "cdktf";
import { CloudwatchLogGroup } from "@cdktf/provider-aws/lib/cloudwatch-log-group";


export interface StandardLambdaProps {
  lambdaName: string;
}

/// To create AWS Lambda and associate it with other resources in AWS
export class StandardLambda extends Construct {

  readonly function: LambdaFunction;
  readonly role: IamRole;

  constructor(scope: Construct, id: string, props: StandardLambdaProps) {
    super(scope, id);

    // Define policy so IAM role can be assumed by lambda.
    const lambdaRolePolicy = {
      "Version": "2012-10-17",
      "Statement": [
        {
          "Action": "sts:AssumeRole",
          "Principal": {
            "Service": "lambda.amazonaws.com"
          },
          "Effect": "Allow",
          "Sid": ""
        }
      ]
    };

    // New role for Lambda
    this.role = new IamRole(this, props.lambdaName + "-role", {
      name: props.lambdaName + "-role",
      assumeRolePolicy: JSON.stringify(lambdaRolePolicy)
    });

    // Add basic lambda execution policy
    new IamRolePolicyAttachment(this, "lambda-managed-policy", {
      policyArn: 'arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole',
      role: this.role.name
    });

    // new CloudWatch Log group
    new CloudwatchLogGroup(this, 'lambda-log-group', {
      name: '/aws/lambda/' + props.lambdaName,
      retentionInDays: 30
    });

    // Default code for lambda
    // TODO: Accept the code fiel as parameter.
    const lambdaDefaultcode =
      `
def lambda_handler(event, context):
  print('Hello, world!')
      `

    ///Prepare the lambda code
    const fileName = 'lambda_function.py';
    const folderPath = path.join(process.cwd(), "code");
    const filePath = path.join(folderPath, fileName);

    fs.rmSync(folderPath, { force: true, recursive: true })
    fs.mkdirSync(folderPath, { recursive: true });
    fs.writeFileSync(filePath, lambdaDefaultcode);

    const lambdaCode = new TerraformAsset(this, 'asset', {
      type: AssetType.ARCHIVE,
      path: folderPath
    });

    /// Finally, create the lambda function
    /// TODO: Parameterise as required
    this.function = new LambdaFunction(this, props.lambdaName, {
      functionName: props.lambdaName,
      role: this.role.arn,
      runtime: "python3.9",
      sourceCodeHash: lambdaCode.assetHash,
      filename: lambdaCode.path,
      handler: 'lambda_function.lambda_handler'

    });

  }
}
