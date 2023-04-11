// Copyright (c) HashiCorp, Inc
// SPDX-License-Identifier: MPL-2.0
import "cdktf/lib/testing/adapters/jest"; // Load types for expect matchers
import { App, Testing } from "cdktf";
import { SampleStack } from "../main"
import { SqsQueue } from "@cdktf/provider-aws/lib/sqs-queue";

describe("My CDKTF Application", () => {

  let app: App;
  let stack: SampleStack;

  beforeEach(() => {
    app = Testing.app();
    stack = new SampleStack(app, 'test');
  });

  // // All Unit tests test the synthesised terraform code, it does not create real-world resources
  describe("Unit testing using assertions", () => {
    it("should contain a resource", () => {

      expect(
        Testing.synth((stack))
      ).toHaveResource(SqsQueue);

      expect(
        Testing.synth((stack))
      ).toHaveResourceWithProperties(SqsQueue, {
        name: "SampleQueue"
      });

    });
  });


  describe("Unit testing using snapshots", () => {
    it("Tests the snapshot", () => {
      const app = Testing.app();
      const stack = new SampleStack(app, "test");


      expect(Testing.synth(stack)).toMatchSnapshot();
    })
  });

  describe("Checking validity", () => {
    it("check if the produced terraform configuration is valid", () => {
      const app = Testing.app();
      const stack = new SampleStack(app, "test");
  
      // We need to do a full synth to validate the terraform configuration
      expect(Testing.fullSynth(stack)).toBeValidTerraform();
    });

  });

  it("check if this can be planned", () => {
    const app = Testing.app();
    const stack = new SampleStack(app, "test");

    // We need to do a full synth to plan the terraform configuration
    expect(Testing.fullSynth(stack)).toPlanSuccessfully();
  });

});
