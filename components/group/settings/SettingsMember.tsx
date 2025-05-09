import React, { useEffect, useState } from "react";
import {
  Text,
  View,
  StyleProp,
  ViewStyle,
  TouchableOpacity,
  Image,
} from "react-native";

import { Container } from "../../Container";
import { IconSource, UniversalIcon } from "../../ui/UniversalIcon";
import { User } from "@/lib/API/schemas/User";
import { defaultAske, getAske } from "@/lib/aske";
import globalStyles from "@/constants/styles";

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
    <View style={[globalStyles.row, { marginBottom: 8 }, style]}>
      <Container style={{ flexDirection: "row", alignItems: "center" }}>
        <Image
          source={image}
          style={{ width: 32, height: 32, borderRadius: 100 }}
        />
        <Text
          numberOfLines={1}
          ellipsizeMode="tail"
          style={[globalStyles.smallTitle, { marginLeft: 10 }]}
        >
          {user.name}
        </Text>
      </Container>
      <TouchableOpacity
        style={{ marginLeft: 8 }}
        testID="remove-user-button"
        onPress={onRemove}
      >
        <UniversalIcon
          source={IconSource.FontAwesome6}
          name="circle-minus"
          size={24}
          style={{ position: "relative" }}
        />
      </TouchableOpacity>
    </View>
  );
}
