import { StyleProp, TextStyle } from "react-native";
import FontAwesome6Icon from "@expo/vector-icons/FontAwesome6";
import MaterialIcon from "@expo/vector-icons/MaterialIcons";
import MaterialCommunityIcon from "@expo/vector-icons/MaterialCommunityIcons";

/**
 * You can search the library here: https://icons.expo.fyi
 */

export enum IconSource {
  FontAwesome6,
  MaterialIcons,
  MaterialCommunityIcons,
}

export function UniversalIcon({
  source,
  name,
  size,
  color,
  style,
}: {
  source: IconSource;
  name: string;
  size: number;
  color?: string;
  style?: StyleProp<TextStyle>;
}) {
  switch (source) {
    case IconSource.FontAwesome6: {
      return (
        <FontAwesome6Icon
          name={name as any}
          size={size}
          color={color}
          style={style}
        />
      );
    }
    case IconSource.MaterialIcons: {
      return (
        <MaterialIcon
          name={name as any}
          size={size}
          color={color}
          style={style}
        />
      );
    }
    case IconSource.MaterialCommunityIcons: {
      return (
        <MaterialCommunityIcon
          name={name as any}
          size={size}
          color={color}
          style={style}
        />
      );
    }
  }
}
