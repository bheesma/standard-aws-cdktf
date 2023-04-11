// Copyright (c) HashiCorp, Inc
// SPDX-License-Identifier: MPL-2.0
import "cdktf/lib/testing/adapters/jest"; // Load types for expect matchers
import { Testing } from "cdktf";
import { LambdaSQSPattern } from "../../patterns/LambdaSQSPattern";
import { LambdaEventSourceMapping } from "@cdktf/provider-aws/lib/lambda-event-source-mapping";

describe("LambdaSQSPattern Construct", () => {

  const synthedLambdaSQSPattern = Testing.synthScope((scope) => {
    new LambdaSQSPattern(scope, "app", {
      queueName: "SampleQueue",
      lambdaName: "SampleLambda"
    });
  });


  it("creates lambda with event source mapping", () => {
    expect(synthedLambdaSQSPattern).toHaveResourceWithProperties(LambdaEventSourceMapping, {
      batch_size: 10
      //TODO: Find out how to test Event source mapping ARN
    })
  })

  it("matches the snapshot", () => {
    expect(synthedLambdaSQSPattern).toMatchSnapshot();
  })

});
