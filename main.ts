import { Construct } from "constructs";
import { App, TerraformStack } from "cdktf";
import { AwsProvider } from "@cdktf/provider-aws/lib/provider";
import { LambdaSQSPattern } from "./patterns/LambdaSQSPattern";

/// This is a sample stack. There's no need to use this stack.
/// Package this as a node library and use the standard constructs
/// and patterns defined in this library.

export class SampleStack extends TerraformStack {
  constructor(scope: Construct, id: string) {
    super(scope, id);

    new AwsProvider(this,'aws',{
      region: "ap-southeast-2"
    });

    new LambdaSQSPattern(this,'SampleLambdaSQS',{
      queueName: "SampleQueue",
      lambdaName: "SampleLambda"
    });

  }
}

const app = new App();
new SampleStack(app, "app");
app.synth();
