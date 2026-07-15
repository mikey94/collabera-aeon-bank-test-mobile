import { describe, it } from "@jest/globals";
import { by, expect as detoxExpect, device, element, waitFor } from "detox";

describe("Transaction flow", () => {
  it("shows the transaction list, opens a detail screen, and can share it", async () => {
    // List loads (mock API has ~400ms simulated latency)
    await waitFor(element(by.id("transaction-list")))
      .toBeVisible()
      .withTimeout(5000);

    await detoxExpect(element(by.id("transaction-item-123ABC"))).toBeVisible();

    // Navigate to detail
    await element(by.id("transaction-item-123ABC")).tap();

    await waitFor(element(by.id("transaction-detail")))
      .toBeVisible()
      .withTimeout(3000);

    await detoxExpect(element(by.text("123ABC"))).toBeVisible();
    await detoxExpect(element(by.text("John Doe"))).toBeVisible();

    await element(by.id("share-button")).tap();

    await waitFor(element(by.id("transaction-detail")))
      .toExist()
      .withTimeout(2000);
  });

  it("navigates back to the list from the detail screen", async () => {
    await waitFor(element(by.id("transaction-list")))
      .toBeVisible()
      .withTimeout(5000);

    await element(by.id("transaction-item-456DEF")).tap();

    await waitFor(element(by.id("transaction-detail")))
      .toBeVisible()
      .withTimeout(3000);

    await device.pressBack();
    await detoxExpect(element(by.id("transaction-list"))).toBeVisible();
  });
});
