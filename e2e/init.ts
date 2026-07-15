import { beforeAll, beforeEach } from "@jest/globals";
import { device } from "detox";

beforeAll(async () => {
  await device.launchApp();
});

beforeEach(async () => {
  await device.reloadReactNative();
});
