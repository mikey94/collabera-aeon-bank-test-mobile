import { colors } from "@/theme/colors";
import { spacing } from "@/theme/spacing";
import { Pressable, StyleSheet, Text, View } from "react-native";

interface Props {
  message: string;
  onRetry: () => void;
}

export function ErrorState({ message, onRetry }: Props) {
  return (
    <View style={styles.container} testID="error-state">
      <Text style={styles.message}>{message}</Text>
      <Pressable
        onPress={onRetry}
        style={styles.retryButton}
        testID="error-retry-button"
      >
        <Text style={styles.retryText}>Retry</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: spacing.lg,
  },
  message: {
    fontSize: 15,
    color: colors.negative,
    textAlign: "center",
    marginBottom: spacing.md,
  },
  retryButton: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.lg,
    backgroundColor: colors.accent,
    borderRadius: 8,
  },
  retryText: {
    color: colors.surface,
    fontWeight: "600",
  },
});
