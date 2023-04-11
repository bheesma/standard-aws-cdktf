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

  readonly patternLambda: StandardLambda;
  readonly patternQueue: StandardSQS

  constructor(scope: Construct, id: string, props: StandardSQSProps) {
    super(scope, id);

    //Create Lambda
    this.patternLambda = new StandardLambda(this, 'stanLambda', {
      lambdaName: props.lambdaName
    });

    //Create SQS queue
    this.patternQueue = new StandardSQS(this, 'stanQueue', {
      queueName: props.queueName
    });

    //Let the queue trigger the lambda
    this.patternQueue.triggerLambda(this.patternLambda);

  }
}
