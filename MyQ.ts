import { Construct } from "constructs";
import { SqsQueue } from "@cdktf/provider-aws/lib/sqs-queue";
import  { AwsProvider } from "@cdktf/provider-aws/lib/provider";

export class MyQConstruct extends Construct {
    
  constructor(scope: Construct, id: string) {
    super(scope, id);

    // define resources here

    new AwsProvider(this,'aws',{
      region: "ap-southeast-2"
    });

    const queueName = 'MyQueueConstruct';
    new SqsQueue(this, queueName, {
      name: queueName
    });



  }
}
