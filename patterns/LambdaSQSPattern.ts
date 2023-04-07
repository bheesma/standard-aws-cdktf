import { Construct } from "constructs";
import { StandardLambda } from "../constructs/StandardLambda";
import { StandardSQS } from "../constructs/StandardSQS";


export interface StandardSQSProps {
  queueName: string,
  lambdaName: string
}

export class LambdaSQSPattern extends Construct {

  constructor(scope: Construct, id: string, props: StandardSQSProps) {
    super(scope, id);

    const lambda = new StandardLambda(this, 'stanLambda', {
      lambdaName: props.lambdaName
    });

    const queue = new StandardSQS(this,'stanQueue',{
      queueName: props.queueName
    });

    queue.triggerLambda(lambda);

  }
}
