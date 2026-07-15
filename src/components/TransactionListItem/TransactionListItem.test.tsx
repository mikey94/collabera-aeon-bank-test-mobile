import { Transaction } from "@/api/types";
import { describe, expect, it, jest } from "@jest/globals";
import { fireEvent, render, screen } from "@testing-library/react-native";
import { TransactionListItem } from "./TransactionListItem";

const positiveTransaction: Transaction = {
  refId: "123ABC",
  transferDate: "2024-10-15T12:34:56Z",
  recipientName: "John Doe",
  transferName: "Salary Payment",
  amount: 1500.0,
};

const negativeTransaction: Transaction = {
  refId: "789GHI",
  transferDate: "2024-10-05T16:18:30Z",
  recipientName: "Robert Brown",
  transferName: "Refund",
  amount: -500.0,
};

describe("TransactionListItem", () => {
  it("renders the transfer name, date, and formatted amount", () => {
    render(
      <TransactionListItem
        transaction={positiveTransaction}
        onPress={jest.fn()}
      />,
    );

    expect(screen.getByText("Salary Payment")).toBeTruthy();
    expect(screen.getByText("15 Oct 2024")).toBeTruthy();
    expect(screen.getByText("+$1,500.00")).toBeTruthy();
  });

  it("renders negative amounts", () => {
    render(
      <TransactionListItem
        transaction={negativeTransaction}
        onPress={jest.fn()}
      />,
    );

    expect(screen.getByText("-$500.00")).toBeTruthy();
  });

  it("calls onPress with the refId when tapped", () => {
    const onPress = jest.fn();
    render(
      <TransactionListItem
        transaction={positiveTransaction}
        onPress={onPress}
      />,
    );

    fireEvent.press(screen.getByTestId("transaction-item-123ABC"));

    expect(onPress).toHaveBeenCalledWith("123ABC");
  });
});
