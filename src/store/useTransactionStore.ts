import { fetchTransactions } from "@/api/transactions";
import { Transaction } from "@/api/types";
import { create } from "zustand";

type Status = "idle" | "loading" | "success" | "error";

interface TransactionState {
  transactions: Transaction[];
  status: Status;
  error: string | null;
  fetchTransactions: () => Promise<void>;
  getTransactionByRefId: (refId: string) => Transaction | undefined;
}

export const useTransactionStore = create<TransactionState>((set, get) => ({
  transactions: [],
  status: "idle",
  error: null,

  fetchTransactions: async () => {
    set({ status: "loading", error: null });
    try {
      const response = await fetchTransactions();
      set({ transactions: response.data, status: "success" });
    } catch (err) {
      set({
        status: "error",
        error:
          err instanceof Error ? err.message : "Failed to load transactions",
      });
    }
  },

  getTransactionByRefId: (refId) =>
    get().transactions.find((t) => t.refId === refId),
}));
