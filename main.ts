import { Construct } from "constructs";
import { App, TerraformStack } from "cdktf";
// import * as sqs from 'aws-cdk-lib/aws-sqs';
import  { AwsProvider } from "@cdktf/provider-aws/lib/provider";

class MyStack extends TerraformStack {
  constructor(scope: Construct, id: string) {
    super(scope, id);

    // define resources here

    new AwsProvider(this,'aws',{
      region: "ap-southeast-2"
    });

 /*    const queueName = 'MyQueue2';
    new sqs.Queue(this, queueName, {
      queueName: queueName
    });

 */

  }
}

const app = new App();
new MyStack(app, "app");
app.synth();
