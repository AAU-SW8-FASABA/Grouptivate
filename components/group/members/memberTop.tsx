import { Text, View, Image } from "react-native";
import { ProgressBarPercentage } from "@/components/ProgressBar/ProgressBarPercentage";
import globalStyles from "@/constants/styles";
import { getAske } from "@/lib/Aske";

interface Props {
  user: { id: string; name: string; progress: number };
}

export default function MemberComponentTop({ user }: Props) {
  return (
    <>
      <Image
        source={getAske({ userId: user.id, name: user.name })}
        style={{ width: 32, height: 32, borderRadius: 100 }}
      />
      <Text
        numberOfLines={1}
        ellipsizeMode="tail"
        style={[
          globalStyles.mediumTitle,
          { marginHorizontal: 6, flexShrink: 1 },
        ]}
      >
        {user.name}
      </Text>
      <View style={{ minWidth: "40%", marginRight: 6, flexGrow: 1 }}>
        <ProgressBarPercentage progress={user.progress} target={100} />
      </View>
    </>
  );
}
