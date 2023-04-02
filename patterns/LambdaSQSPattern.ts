import { Construct } from "constructs";
import { SqsQueue } from "@cdktf/provider-aws/lib/sqs-queue";
import { LambdaFunction } from "@cdktf/provider-aws/lib/lambda-function";
import { IamRole } from "@cdktf/provider-aws/lib/iam-role";
import { IamRolePolicyAttachment } from "@cdktf/provider-aws/lib/iam-role-policy-attachment";
import * as path from 'path';
import * as fs from 'fs';
import { AssetType, TerraformAsset } from "cdktf";

export interface StandardSQSProps {
  queueName: string,
  lambdaName: string
}

export class LambdaSQSPattern extends Construct {
    
  constructor(scope: Construct, id: string, props: StandardSQSProps) {
    super(scope, id);

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

    const role = new IamRole(this,props.lambdaName+"-role", {
      name: props.lambdaName+"-role",
      assumeRolePolicy: JSON.stringify(lambdaRolePolicy)
    });

    new IamRolePolicyAttachment(this, "lambda-managed-policy", {
      policyArn: 'arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole',
      role: role.name
    });

    const lambdaDefaultcode = 
    `
    def lambda_handler(event, context):
      print('Hello, world!')
    `
    const fileName = 'lambda_function.py';
    const folderPath = path.join(process.cwd(),"code");
    const filePath = path.join(folderPath, fileName);
    fs.rmSync(folderPath,{ force: true, recursive: true })
    fs.mkdirSync(folderPath, { recursive: true });
    fs.writeFileSync(filePath, lambdaDefaultcode);
    console.log(fs.readFileSync(filePath));

    const lambdaCode = new TerraformAsset(this,'asset',{
      type: AssetType.ARCHIVE,
      path: folderPath
    });

    new LambdaFunction(this,props.lambdaName, {
      functionName: props.lambdaName,
      role: role.arn,
      runtime: "Python3.9",
      sourceCodeHash: lambdaCode.assetHash
    });

    new SqsQueue(this, props.queueName, {
      name: props.queueName
    });

  }
}
