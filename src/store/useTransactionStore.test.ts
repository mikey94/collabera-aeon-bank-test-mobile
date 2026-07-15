import { fetchTransactions } from "@/api/transactions";
import { Transaction } from "@/api/types";
import { beforeEach, describe, expect, it, jest } from "@jest/globals";
import { useTransactionStore } from "./useTransactionStore";

jest.mock("@/api/transactions");

const mockedFetchTransactions = fetchTransactions as jest.MockedFunction<
  typeof fetchTransactions
>;

const sampleTransactions: Transaction[] = [
  {
    refId: "123ABC",
    transferDate: "2024-10-15T12:34:56Z",
    recipientName: "John Doe",
    transferName: "Salary Payment",
    amount: 1500.0,
  },
];

describe("useTransactionStore", () => {
  beforeEach(() => {
    useTransactionStore.setState({
      transactions: [],
      status: "idle",
      error: null,
    });
    jest.clearAllMocks();
  });

  it("sets status to loading then success on a successful fetch", async () => {
    mockedFetchTransactions.mockResolvedValueOnce({ data: sampleTransactions });

    const promise = useTransactionStore.getState().fetchTransactions();
    expect(useTransactionStore.getState().status).toBe("loading");

    await promise;

    expect(useTransactionStore.getState().status).toBe("success");
    expect(useTransactionStore.getState().transactions).toEqual(
      sampleTransactions,
    );
  });

  it("sets status to error when the fetch rejects", async () => {
    mockedFetchTransactions.mockRejectedValueOnce(new Error("Network down"));

    await useTransactionStore.getState().fetchTransactions();

    expect(useTransactionStore.getState().status).toBe("error");
    expect(useTransactionStore.getState().error).toBe("Network down");
  });

  it("getTransactionByRefId returns the matching transaction", async () => {
    mockedFetchTransactions.mockResolvedValueOnce({ data: sampleTransactions });
    await useTransactionStore.getState().fetchTransactions();

    const found = useTransactionStore
      .getState()
      .getTransactionByRefId("123ABC");
    expect(found).toEqual(sampleTransactions[0]);
  });

  it("getTransactionByRefId returns undefined for an unknown refId", () => {
    const found = useTransactionStore.getState().getTransactionByRefId("nope");
    expect(found).toBeUndefined();
  });
});
