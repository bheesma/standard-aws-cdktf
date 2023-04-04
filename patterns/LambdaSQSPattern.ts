import { Construct } from "constructs";
import { SqsQueue } from "@cdktf/provider-aws/lib/sqs-queue";
import { StandardLambda } from "../constructs/StandardLambda";
import { StandardSQS } from "../constructs/StandardSQS";


export interface StandardSQSProps {
  queueName: string,
  lambdaName: string
}

export class LambdaSQSPattern extends Construct {

  constructor(scope: Construct, id: string, props: StandardSQSProps) {
    super(scope, id);

    new StandardLambda(this, 'stanLambda', {
      lambdaName: props.lambdaName
    })

    new StandardSQS(this,'stanQueue',{
      queueName: props.queueName
    })

  }
}
