import { EmptyState } from "@/components/EmptyState";
import { ErrorState } from "@/components/ErrorState";
import { TransactionListItem } from "@/components/TransactionListItem";
import { useTransactionStore } from "@/store/useTransactionStore";
import { colors } from "@/theme/colors";
import { useRouter } from "expo-router";
import { useEffect } from "react";
import { ActivityIndicator, FlatList, StyleSheet, View } from "react-native";

export function TransactionListScreen() {
  const router = useRouter();
  const transactions = useTransactionStore((s) => s.transactions);
  const status = useTransactionStore((s) => s.status);
  const error = useTransactionStore((s) => s.error);
  const fetchTransactions = useTransactionStore((s) => s.fetchTransactions);

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  const handlePressItem = (refId: string) => {
    router.push({ pathname: "/transaction/[refId]", params: { refId } });
  };

  if (status === "loading" || status === "idle") {
    return (
      <View style={styles.centered} testID="loading-indicator">
        <ActivityIndicator size="large" color={colors.accent} />
      </View>
    );
  }

  if (status === "error") {
    return (
      <ErrorState
        message={error ?? "Something went wrong."}
        onRetry={fetchTransactions}
      />
    );
  }

  if (transactions.length === 0) {
    return <EmptyState />;
  }

  return (
    <FlatList
      testID="transaction-list"
      data={transactions}
      keyExtractor={(item) => item.refId}
      renderItem={({ item }) => (
        <TransactionListItem transaction={item} onPress={handlePressItem} />
      )}
    />
  );
}

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
