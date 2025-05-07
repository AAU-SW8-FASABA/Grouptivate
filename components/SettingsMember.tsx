import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  StyleProp,
  ViewStyle,
  TouchableOpacity,
  Image,
} from "react-native";

import { Container } from "./Container";
import { IconSource, UniversalIcon } from "./ui/UniversalIcon";
import { User } from "@/lib/API/schemas/User";
import { defaultAske, getAske } from "@/lib/aske";

interface Props {
  user: Pick<User, "userId" | "name">;
  style?: StyleProp<ViewStyle>;
  onRemove?: () => void;
}

export function SettingsMember({ user, style, onRemove }: Props) {
  const [image, setImage] = useState(defaultAske);
  useEffect(() => {
    setImage(getAske(user));
  }, [user]);

  return (
    <View style={[styles.row, style]}>
      <Container style={{ flexDirection: "row" }}>
        <Image
          source={image}
          style={{ width: 32, height: 32, borderRadius: 100 }}
        />
        <Text numberOfLines={1} style={{ ...styles.text, marginLeft: 10 }}>
          {user.name}
        </Text>
      </Container>
      <TouchableOpacity testID="remove-user-button" onPress={onRemove}>
        <UniversalIcon
          source={IconSource.FontAwesome6}
          name="circle-minus"
          size={24}
          style={{ marginTop: 10, marginLeft: 5 }}
        />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  text: {
    fontFamily: "Roboto",
    fontWeight: 500,
    fontSize: 20,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
});
