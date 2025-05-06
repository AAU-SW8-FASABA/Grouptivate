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
      <View style={styles.row}>
        <View style={{ flexDirection: "row" }}>
          <Image
            source={image}
            style={{ width: 32, height: 32, borderRadius: 100 }}
          />
          <Text style={[styles.text, { fontSize: 24, marginLeft: 10 }]}>
            {group.groupName}
          </Text>
        </View>
        <Text style={[styles.text, { fontSize: 16 }]}>{daysLeft}</Text>
      </View>
      <HR />
      <ProgressBarIcon
        progress={groupProgress}
        iconSource={IconSource.FontAwesome6}
        icon="users"
        iconSize={20}
      />
      <ProgressBarIcon
        progress={individualProgress}
        iconSource={IconSource.FontAwesome6}
        icon="user-large"
        iconSize={20}
      />
    </Container>
  );
}

const styles = StyleSheet.create({
  text: {
    fontFamily: "Roboto",
    fontWeight: 500,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  progress: {
    flex: 1,
  },
  progressText: {
    fontFamily: "Roboto",
    fontWeight: 500,
    fontSize: 16,
    position: "absolute",
    top: "50%",
    transform: "translate(-50%, -50%)",
  },
});
