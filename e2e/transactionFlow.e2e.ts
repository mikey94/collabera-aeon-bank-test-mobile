import { describe, it } from "@jest/globals";
import { by, expect as detoxExpect, element, waitFor } from "detox";

describe("Transaction flow", () => {
  it("shows the transaction list, opens a detail screen, and can share it", async () => {
    // List loads (mock API has ~400ms simulated latency)
    await waitFor(element(by.id("transaction-list")))
      .toBeVisible()
      .withTimeout(15000);

    await detoxExpect(element(by.id("transaction-item-123ABC"))).toBeVisible();

    // Navigate to detail
    await element(by.id("transaction-item-123ABC")).tap();

    await waitFor(element(by.id("transaction-detail")))
      .toBeVisible()
      .withTimeout(3000);

    await detoxExpect(element(by.text("123ABC"))).toBeVisible();
    await detoxExpect(element(by.text("John Doe"))).toBeVisible();

    await detoxExpect(element(by.id("share-button"))).toBeVisible();
  });

  it("navigates back to the list from the detail screen", async () => {
    await waitFor(element(by.id("transaction-list")))
      .toBeVisible()
      .withTimeout(15000);

    await element(by.id("transaction-item-456DEF")).tap();

    await waitFor(element(by.id("transaction-detail")))
      .toBeVisible()
      .withTimeout(3000);

    await element(by.id("back-button")).tap();

    await waitFor(element(by.id("transaction-list")))
      .toBeVisible()
      .withTimeout(3000);
  });
});
