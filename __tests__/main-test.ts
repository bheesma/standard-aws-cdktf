// Copyright (c) HashiCorp, Inc
// SPDX-License-Identifier: MPL-2.0
import "cdktf/lib/testing/adapters/jest"; // Load types for expect matchers
import { Testing } from "cdktf";
import { MyStack } from "../main"
import { SqsQueue } from "@cdktf/provider-aws/lib/sqs-queue";

describe("My CDKTF Application", () => {

  // // All Unit tests test the synthesised terraform code, it does not create real-world resources
  describe("Unit testing using assertions", () => {
    it("should contain a resource", () => {
      const app = Testing.app();

      const stack = new MyStack(app, "test");

      expect(
        Testing.synth((stack))
      ).toHaveResource(SqsQueue);

      expect(
        Testing.synth((stack))
      ).toHaveResourceWithProperties(SqsQueue, {
        name: "MyQueue2"
      });

    });
  });

  describe("Unit testing using snapshots", () => {
    it("Tests the snapshot", () => {
      const app = Testing.app();
      const stack = new MyStack(app, "test");


      expect(Testing.synth(stack)).toMatchSnapshot();
    })
  });

  describe("Checking validity", () => {
    it("check if the produced terraform configuration is valid", () => {
      const app = Testing.app();
      const stack = new MyStack(app, "test");
  
      // We need to do a full synth to validate the terraform configuration
      expect(Testing.fullSynth(stack)).toBeValidTerraform();
    });

  });

  it("check if this can be planned", () => {
    const app = Testing.app();
    const stack = new MyStack(app, "test");

    // We need to do a full synth to plan the terraform configuration
    expect(Testing.fullSynth(stack)).toPlanSuccessfully();
  });

});
