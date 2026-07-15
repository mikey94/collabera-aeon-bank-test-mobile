import Ionicons from "@expo/vector-icons/Ionicons";
import { Stack, useRouter } from "expo-router";
import { Pressable } from "react-native";

export default function RootLayout() {
  const router = useRouter();

  return (
    <Stack>
      <Stack.Screen name="index" options={{ title: "Transactions" }} />
      <Stack.Screen
        name="transaction/[refId]"
        options={{
          title: "Transaction Details",
          headerLeft: () => (
            <Pressable testID="back-button" onPress={() => router.back()}>
              <Ionicons name="chevron-back" size={22} color="#007AFF" />
            </Pressable>
          ),
        }}
      />
    </Stack>
  );
}
