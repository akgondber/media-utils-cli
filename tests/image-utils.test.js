import { test } from "uvu";
import * as assert from "uvu/assert";
import * as videoUtils from "../source/video-utils.js";

test("has util functions", () => {
  assert.type(videoUtils.convertVideoToGif, "function");
  assert.type(videoUtils.convertAllFilesToGif, "function");
});

test.run();
