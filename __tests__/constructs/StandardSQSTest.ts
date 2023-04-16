// Copyright (c) HashiCorp, Inc
// SPDX-License-Identifier: MPL-2.0
import "cdktf/lib/testing/adapters/jest"; // Load types for expect matchers
import { Testing } from "cdktf";
import { SqsQueue } from "@cdktf/provider-aws/lib/sqs-queue";
import { StandardSQS } from "../../constructs/StandardSQS";

describe("StandardSQS Construct", () => {

  const synthedQueue = Testing.synthScope((scope) => {
    new StandardSQS(scope, "app", {
      queueName: "SampleQueue"
    });
  });

  it("generates SQS queue with the name", () => {
    expect(synthedQueue).toHaveResourceWithProperties(SqsQueue, {
      name: "SampleQueue"
    });
  })

  it("generates SQS Dead Letter queue with the name", () => {
    expect(synthedQueue).toHaveResourceWithProperties(SqsQueue, {
      name: "SampleQueue-dlq"
    });
  })

  it("matches the snapshot", () => {
    expect(synthedQueue).toMatchSnapshot();
  })

});
