// Copyright (c) HashiCorp, Inc
// SPDX-License-Identifier: MPL-2.0
import "cdktf/lib/testing/adapters/jest"; // Load types for expect matchers
import { Testing } from "cdktf";
import { SqsQueue } from "@cdktf/provider-aws/lib/sqs-queue";
import { MyQConstruct } from "../MyQ";

describe("My CDKTF Construct", () => {


  describe("construct", () => {
    it("Construct", () => {
      expect(
        Testing.synthScope((scope) => {
          new MyQConstruct(scope, "app");
        })
      ).toHaveResourceWithProperties(SqsQueue, {
        name: "MyQueueConstruct"
      });
    })
  });

  describe("Unit testing using snapshots", () => {
    it("Tests the snapshot", () => {

      expect(Testing.synthScope((scope) => {
        new MyQConstruct(scope, "app");
      })).toMatchSnapshot();

    })
  });


});
