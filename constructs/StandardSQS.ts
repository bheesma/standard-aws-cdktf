import { Construct } from "constructs";
import { SqsQueue } from "@cdktf/provider-aws/lib/sqs-queue";
import { LambdaEventSourceMapping } from "@cdktf/provider-aws/lib/lambda-event-source-mapping";
import { StandardLambda } from "./StandardLambda";

export interface StandardSQSProps {
  queueName: string;
}

export class StandardSQS extends Construct {

  private queue: SqsQueue;

  constructor(scope: Construct, id: string, props: StandardSQSProps) {
    super(scope, id);

    this.queue = new SqsQueue(this, props.queueName, {
      name: props.queueName
    });

  }

  triggerLambda(lambda: StandardLambda, batchSize: number = 10) {
    new LambdaEventSourceMapping(this, 'evmap', {
      functionName: lambda.function.functionName,
      eventSourceArn: this.queue.arn,
      batchSize: batchSize,
    }
    );
  }
}
