import { Construct } from "constructs";
import { App, TerraformStack } from "cdktf";
import { SqsQueue } from "@cdktf/provider-aws/lib/sqs-queue";
import  { AwsProvider } from "@cdktf/provider-aws/lib/provider";

class MyStack extends TerraformStack {
  constructor(scope: Construct, id: string) {
    super(scope, id);

    // define resources here

    new AwsProvider(this,'aws',{
      region: "ap-southeast-2"
    });

    const queueName = 'MyQueue2';
    new SqsQueue(this, queueName, {
      name: queueName
    });



  }
}

const app = new App();
new MyStack(app, "app");
app.synth();
