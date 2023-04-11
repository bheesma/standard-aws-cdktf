import { Construct } from "constructs";
import { SqsQueue } from "@cdktf/provider-aws/lib/sqs-queue";
import { LambdaEventSourceMapping } from "@cdktf/provider-aws/lib/lambda-event-source-mapping";
import { StandardLambda } from "./StandardLambda";

export interface StandardSQSProps {
  queueName: string;
}

/// To create SQS queue and associate it with other resources in AWS.
export class StandardSQS extends Construct {

  readonly queue: SqsQueue;
  readonly deadLetterQueue: SqsQueue;

  constructor(scope: Construct, id: string, props: StandardSQSProps) {
    super(scope, id);

    /// Create dead letter queue
    this.deadLetterQueue = new SqsQueue(this, props.queueName + '-dlq', {
      name: props.queueName + '-dlq',
      sqsManagedSseEnabled: true
    })


    /// Create SQS queue
    this.queue = new SqsQueue(this, props.queueName, {
      name: props.queueName,
      sqsManagedSseEnabled: true,
      redrivePolicy: JSON.stringify({
        deadLetterTargetArn: this.deadLetterQueue.arn,
        maxReceiveCount: 5
      })
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
