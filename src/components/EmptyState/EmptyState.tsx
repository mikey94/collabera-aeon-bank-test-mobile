import { colors } from "@/theme/colors";
import { spacing } from "@/theme/spacing";
import { StyleSheet, Text, View } from "react-native";

interface Props {
  message?: string;
}

export function EmptyState({ message = "No transactions yet." }: Props) {
  return (
    <View style={styles.container} testID="empty-state">
      <Text style={styles.message}>{message}</Text>
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
    color: colors.textSecondary,
    textAlign: "center",
  },
});
