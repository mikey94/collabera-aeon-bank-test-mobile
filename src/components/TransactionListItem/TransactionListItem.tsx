import { Transaction } from "@/api/types";
import { colors } from "@/theme/colors";
import { spacing } from "@/theme/spacing";
import { formatCurrency } from "@/utils/formatCurrency";
import { formatDate } from "@/utils/formatDate";
import { Pressable, StyleSheet, Text, View } from "react-native";

interface Props {
  transaction: Transaction;
  onPress: (refId: string) => void;
}

export function TransactionListItem({ transaction, onPress }: Props) {
  const isNegative = transaction.amount < 0;

  return (
    <Pressable
      testID={`transaction-item-${transaction.refId}`}
      onPress={() => onPress(transaction.refId)}
      style={({ pressed }) => [styles.container, pressed && styles.pressed]}
    >
      <View style={styles.details}>
        <Text style={styles.transferName}>{transaction.transferName}</Text>
        <Text style={styles.date}>{formatDate(transaction.transferDate)}</Text>
      </View>
      <Text
        style={[styles.amount, isNegative ? styles.negative : styles.positive]}
      >
        {formatCurrency(transaction.amount)}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: colors.surface,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  pressed: {
    opacity: 0.6,
  },
  details: {
    flexShrink: 1,
    marginRight: spacing.sm,
  },
  transferName: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.textPrimary,
  },
  date: {
    fontSize: 13,
    color: colors.textSecondary,
    marginTop: spacing.xs / 2,
  },
  amount: {
    fontSize: 16,
    fontWeight: "600",
  },
  positive: {
    color: colors.positive,
  },
  negative: {
    color: colors.negative,
  },
});
