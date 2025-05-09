import {
  StyleSheet,
  StyleProp,
  ViewStyle,
  View,
  Text,
  Image,
} from "react-native";
import { useEffect, useState } from "react";

import { HR } from "./HR";
import { IconSource } from "./ui/UniversalIcon";
import { Container } from "./Container";
import { ProgressBarIcon } from "./ProgressBar/ProgressBarIcon";
import { defaultAske, getAske } from "@/lib/aske";
import { Group } from "@/lib/API/schemas/Group";
import globalStyles from "@/constants/styles";

export function GroupContainer({
  group,
  days,
  groupProgress,
  individualProgress,
  style,
}: {
  group: Pick<Group, "groupId" | "groupName" | "users">;
  days: number;
  groupProgress: number;
  individualProgress: number;
  style?: StyleProp<ViewStyle>;
}) {
  const [image, setImage] = useState(defaultAske);
  useEffect(() => {
    setImage(getAske(group));
  }, [group]);
  let daysLeft = days + " days left";
  if (days === 1) {
    daysLeft = "Today";
  }

  return (
    <Container style={style}>
      <View style={[{ display: "flex" }, globalStyles.row]}>
        <Image
          source={image}
          style={{
            width: 32,
            height: 32,
            borderRadius: 100,
            position: "relative",
          }}
        />
        <Text
          numberOfLines={1}
          ellipsizeMode="tail"
          style={[globalStyles.title, { flexShrink: 1, marginHorizontal: 8 }]}
        >
          {group.groupName}
        </Text>
        <Text style={[globalStyles.bodyText, { marginRight: 20 }]}>
          {daysLeft}
        </Text>
      </View>
      <HR />
      <ProgressBarIcon
        progress={groupProgress}
        iconSource={IconSource.FontAwesome6}
        icon="users"
        iconSize={16}
      />
      <View style={{ paddingRight: 0 }}>
        <ProgressBarIcon
          progress={individualProgress}
          iconSource={IconSource.FontAwesome6}
          icon="user-large"
          iconSize={20}
        />
      </View>
    </Container>
  );
}

const styles = StyleSheet.create({
  progress: {
    flex: 1,
  },
});
