import { useTransactionStore } from "@/store/useTransactionStore";
import { colors } from "@/theme/colors";
import { spacing } from "@/theme/spacing";
import { formatCurrency } from "@/utils/formatCurrency";
import { formatDateTime } from "@/utils/formatDate";
import { useLocalSearchParams } from "expo-router";
import { useCallback } from "react";
import { Pressable, Share, StyleSheet, Text, View } from "react-native";

function buildShareMessage(params: {
  refId: string;
  date: string;
  recipientName: string;
  amount: string;
}) {
  return [
    "Transaction Details",
    `Reference ID: ${params.refId}`,
    `Date: ${params.date}`,
    `Recipient: ${params.recipientName}`,
    `Amount: ${params.amount}`,
  ].join("\n");
}

export function TransactionDetailScreen() {
  const { refId } = useLocalSearchParams<{ refId: string }>();
  const transaction = useTransactionStore((s) =>
    s.getTransactionByRefId(refId),
  );

  const handleShare = useCallback(async () => {
    if (!transaction) return;
    try {
      await Share.share({
        message: buildShareMessage({
          refId: transaction.refId,
          date: formatDateTime(transaction.transferDate),
          recipientName: transaction.recipientName,
          amount: formatCurrency(transaction.amount),
        }),
      });
    } catch {
      console.error("Failed to share transaction details.");
    }
  }, [transaction]);

  if (!transaction) {
    return (
      <View style={styles.centered} testID="transaction-not-found">
        <Text style={styles.notFoundText}>Transaction not found.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container} testID="transaction-detail">
      <DetailRow label="Reference ID" value={transaction.refId} />
      <DetailRow
        label="Date"
        value={formatDateTime(transaction.transferDate)}
      />
      <DetailRow label="Recipient" value={transaction.recipientName} />
      <DetailRow
        label="Amount"
        value={formatCurrency(transaction.amount)}
        valueStyle={transaction.amount < 0 ? styles.negative : styles.positive}
      />

      <Pressable
        testID="share-button"
        style={({ pressed }) => [
          styles.shareButton,
          pressed && styles.shareButtonPressed,
        ]}
        onPress={handleShare}
      >
        <Text style={styles.shareButtonText}>Share</Text>
      </Pressable>
    </View>
  );
}

function DetailRow({
  label,
  value,
  valueStyle,
}: {
  label: string;
  value: string;
  valueStyle?: object;
}) {
  return (
    <View style={styles.row}>
      <Text style={styles.label}>{label}</Text>
      <Text style={[styles.value, valueStyle]}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: spacing.lg,
  },
  centered: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  notFoundText: {
    color: colors.textSecondary,
    fontSize: 15,
  },
  row: {
    marginBottom: spacing.lg,
  },
  label: {
    fontSize: 13,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
  },
  value: {
    fontSize: 17,
    fontWeight: "600",
    color: colors.textPrimary,
  },
  positive: {
    color: colors.positive,
  },
  negative: {
    color: colors.negative,
  },
  shareButton: {
    marginTop: spacing.md,
    backgroundColor: colors.accent,
    paddingVertical: spacing.md,
    borderRadius: 8,
    alignItems: "center",
  },
  shareButtonPressed: {
    opacity: 0.8,
  },
  shareButtonText: {
    color: colors.surface,
    fontSize: 16,
    fontWeight: "600",
  },
});
