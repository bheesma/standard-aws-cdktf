import { Construct } from "constructs";
import { SqsQueue } from "@cdktf/provider-aws/lib/sqs-queue";
import  { AwsProvider } from "@cdktf/provider-aws/lib/provider";

export interface StandardSQSProps {
  queueName: string;
}

export class StandardSQS extends Construct {
    
  constructor(scope: Construct, id: string, props: StandardSQSProps) {
    super(scope, id);

    new AwsProvider(this,'aws',{
      region: "ap-southeast-2"
    });

    new SqsQueue(this, props.queueName, {
      name: props.queueName
    });



  }
}
