// Copyright (c) HashiCorp, Inc
// SPDX-License-Identifier: MPL-2.0
import "cdktf/lib/testing/adapters/jest"; // Load types for expect matchers
import { Testing } from "cdktf";
import { StandardLambda } from "../../constructs/StandardLambda";
import { LambdaFunction } from "@cdktf/provider-aws/lib/lambda-function";

describe("StandardLambda Construct", () => {

  const synthedLambda = Testing.synthScope((scope) => {
    new StandardLambda(scope, 'SampleLambda', {
      lambdaName: 'SampleLambda'
    });
  });

  it("generates lambda function with the name", () => {
    expect(synthedLambda).toHaveResourceWithProperties(LambdaFunction, {
      function_name: "SampleLambda"
    });
  })

  it("matches the snapshot", () => {
    expect(synthedLambda).toMatchSnapshot();
  })

});
