import { Construct } from "constructs";
import { StandardLambda } from "../constructs/StandardLambda";
import { StandardSQS } from "../constructs/StandardSQS";


export interface StandardSQSProps {
  queueName: string,
  lambdaName: string
}

/// Define a pattern which creates SQS, Lambda and makes the SQS to be the
/// event source for invoking the lambda.
export class LambdaSQSPattern extends Construct {

  constructor(scope: Construct, id: string, props: StandardSQSProps) {
    super(scope, id);

    //Create Lambda
    const lambda = new StandardLambda(this, 'stanLambda', {
      lambdaName: props.lambdaName
    });

    //Create SQS queue
    const queue = new StandardSQS(this, 'stanQueue', {
      queueName: props.queueName
    });

    //Let the queue trigger the lambda
    queue.triggerLambda(lambda);

  }
}
