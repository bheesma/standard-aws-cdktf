import { Construct } from "constructs";
import { LambdaFunction } from "@cdktf/provider-aws/lib/lambda-function";
import { IamRole } from "@cdktf/provider-aws/lib/iam-role";
import { IamRolePolicyAttachment } from "@cdktf/provider-aws/lib/iam-role-policy-attachment";
import * as path from 'path';
import * as fs from 'fs';
import { AssetType, TerraformAsset } from "cdktf";

export interface StandardLambdaProps {
  lambdaName: string;
}

export class StandardLambda extends Construct {
    
  function: LambdaFunction;

  constructor(scope: Construct, id: string, props: StandardLambdaProps) {
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

    this.function = new LambdaFunction(this,props.lambdaName, {
      functionName: props.lambdaName,
      role: role.arn,
      runtime: "python3.9",
      sourceCodeHash: lambdaCode.assetHash,
      filename: fileName,
      handler: 'lambda_function.lambda_handler'
      
    });

  }
}
