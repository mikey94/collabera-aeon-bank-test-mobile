import { Transaction } from "@/api/types";
import { useTransactionStore } from "@/store/useTransactionStore";
import {
    afterEach,
    beforeEach,
    describe,
    expect,
    it,
    jest,
} from "@jest/globals";
import {
    fireEvent,
    render,
    screen,
    waitFor,
} from "@testing-library/react-native";
import { useLocalSearchParams } from "expo-router";
import { Share } from "react-native";
import { TransactionDetailScreen } from "./TransactionDetailScreen";

jest.mock("expo-router", () => ({
  useLocalSearchParams: jest.fn(),
}));

const mockedUseLocalSearchParams = useLocalSearchParams as jest.MockedFunction<
  typeof useLocalSearchParams
>;

const sampleTransaction: Transaction = {
  refId: "123ABC",
  transferDate: "2024-10-15T12:34:56Z",
  recipientName: "John Doe",
  transferName: "Salary Payment",
  amount: 1500.0,
};

describe("TransactionDetailScreen", () => {
  beforeEach(() => {
    useTransactionStore.setState({
      transactions: [sampleTransaction],
      status: "success",
      error: null,
    });
    jest
      .spyOn(Share, "share")
      .mockResolvedValue({ action: "sharedAction" } as any);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("renders refId, date, recipient, and amount", () => {
    mockedUseLocalSearchParams.mockReturnValue({ refId: "123ABC" } as any);

    render(<TransactionDetailScreen />);

    expect(screen.getByText("123ABC")).toBeTruthy();
    expect(screen.getByText("John Doe")).toBeTruthy();
    expect(screen.getByText("+$1,500.00")).toBeTruthy();
  });

  it("shows a not-found message for an unknown refId", () => {
    mockedUseLocalSearchParams.mockReturnValue({ refId: "unknown" } as any);

    render(<TransactionDetailScreen />);

    expect(screen.getByTestId("transaction-not-found")).toBeTruthy();
  });

  it("invokes the native Share sheet with transaction details when Share is tapped", async () => {
    mockedUseLocalSearchParams.mockReturnValue({ refId: "123ABC" } as any);

    render(<TransactionDetailScreen />);

    fireEvent.press(screen.getByTestId("share-button"));

    await waitFor(() => expect(Share.share).toHaveBeenCalledTimes(1));
    const shareArg = (Share.share as jest.Mock).mock.calls[0][0] as
      { message?: string } | undefined;
    expect(shareArg?.message).toContain("123ABC");
    expect(shareArg?.message).toContain("John Doe");
  });
});
