import { fetchTransactions } from "@/api/transactions";
import { Transaction } from "@/api/types";
import { useTransactionStore } from "@/store/useTransactionStore";
import { beforeEach, describe, expect, it, jest } from "@jest/globals";
import {
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react-native";
import { useRouter } from "expo-router";
import { TransactionListScreen } from "./TransactionListScreen";

jest.mock("@/api/transactions");
jest.mock("expo-router", () => ({
  useRouter: jest.fn(),
}));

const mockedFetchTransactions = fetchTransactions as jest.MockedFunction<
  typeof fetchTransactions
>;
const mockedUseRouter = useRouter as jest.MockedFunction<typeof useRouter>;
const push = jest.fn();

const sampleTransactions: Transaction[] = [
  {
    refId: "123ABC",
    transferDate: "2024-10-15T12:34:56Z",
    recipientName: "John Doe",
    transferName: "Salary Payment",
    amount: 1500.0,
  },
  {
    refId: "456DEF",
    transferDate: "2024-09-21T09:12:45Z",
    recipientName: "Jane Smith",
    transferName: "Invoice Payment",
    amount: 2300.75,
  },
];

describe("TransactionListScreen", () => {
  beforeEach(() => {
    useTransactionStore.setState({
      transactions: [],
      status: "idle",
      error: null,
    });
    jest.resetAllMocks();
    mockedUseRouter.mockReturnValue({ push } as any);
  });

  it("shows a loading indicator while fetching", () => {
    mockedFetchTransactions.mockReturnValue(new Promise(() => {})); // never resolves

    render(<TransactionListScreen />);

    expect(screen.getByTestId("loading-indicator")).toBeTruthy();
  });

  it("renders the transaction list on success", async () => {
    mockedFetchTransactions.mockResolvedValueOnce({ data: sampleTransactions });

    render(<TransactionListScreen />);

    await waitFor(() =>
      expect(screen.getByTestId("transaction-list")).toBeTruthy(),
    );
    expect(screen.getByText("Salary Payment")).toBeTruthy();
    expect(screen.getByText("Invoice Payment")).toBeTruthy();
  });

  it("navigates to the detail route with the refId when an item is tapped", async () => {
    mockedFetchTransactions.mockResolvedValueOnce({ data: sampleTransactions });

    render(<TransactionListScreen />);

    await waitFor(() => screen.getByTestId("transaction-item-123ABC"));
    fireEvent.press(screen.getByTestId("transaction-item-123ABC"));

    expect(push).toHaveBeenCalledWith("/transaction/123ABC");
  });

  it("shows an error state with retry when the fetch fails", async () => {
    mockedFetchTransactions.mockRejectedValueOnce(new Error("Network down"));

    render(<TransactionListScreen />);

    await waitFor(() => expect(screen.getByTestId("error-state")).toBeTruthy());
    expect(screen.getByText("Network down")).toBeTruthy();

    mockedFetchTransactions.mockResolvedValueOnce({ data: sampleTransactions });
    fireEvent.press(screen.getByTestId("error-retry-button"));

    await waitFor(() =>
      expect(screen.getByTestId("transaction-list")).toBeTruthy(),
    );
  });

  it("shows an empty state when there are no transactions", async () => {
    mockedFetchTransactions.mockResolvedValueOnce({ data: [] });

    render(<TransactionListScreen />);

    await waitFor(() => expect(screen.getByTestId("empty-state")).toBeTruthy());
  });
});
