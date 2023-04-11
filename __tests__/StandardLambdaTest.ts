// Copyright (c) HashiCorp, Inc
// SPDX-License-Identifier: MPL-2.0
import "cdktf/lib/testing/adapters/jest"; // Load types for expect matchers
import { Testing } from "cdktf";
import { StandardLambda } from "../constructs/StandardLambda";
import { LambdaFunction } from "@cdktf/provider-aws/lib/lambda-function";

describe("My CDKTF Construct", () => {


  describe("construct", () => {
    it("Construct", () => {
      expect(
        Testing.synthScope((scope) => {
          new StandardLambda(scope, 'SampleLambda', {
            lambdaName: 'SampleLambda'
          });
        })
      ).toHaveResourceWithProperties(LambdaFunction, {
        function_name: "SampleLambda"
      });
    })
  });

  describe("Unit testing using snapshots", () => {
    it("Tests the snapshot", () => {

      expect(Testing.synthScope((scope) => {
        new StandardLambda(scope, 'SampleLambda', {
          lambdaName: 'SampleLambda'
        });
      })).toMatchSnapshot();

    })
  });


});
