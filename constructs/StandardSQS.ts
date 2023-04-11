import { Construct } from "constructs";
import { SqsQueue } from "@cdktf/provider-aws/lib/sqs-queue";
import { LambdaEventSourceMapping } from "@cdktf/provider-aws/lib/lambda-event-source-mapping";
import { StandardLambda } from "./StandardLambda";

export interface StandardSQSProps {
  queueName: string;
}

/// To create SQS queue and associate it with other resources in AWS.
export class StandardSQS extends Construct {

  private queue: SqsQueue;

  constructor(scope: Construct, id: string, props: StandardSQSProps) {
    super(scope, id);

    /// Create SQS queue
    this.queue = new SqsQueue(this, props.queueName, {
      name: props.queueName
    });

  }

  /// Function to add SQS event source mapping to Lambda.
  triggerLambda(lambda: StandardLambda, batchSize: number = 10) {
    new LambdaEventSourceMapping(this, 'evsourcemap', {
      functionName: lambda.function.functionName,
      eventSourceArn: this.queue.arn,
      batchSize: batchSize,
    }
    );
  }
}
