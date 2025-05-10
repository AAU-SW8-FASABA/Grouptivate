import { StyleSheet } from "react-native";
import { useState } from "react";
import globalStyles from "@/constants/styles";
import { Dropdown } from "react-native-element-dropdown";
import { IconSource, UniversalIcon } from "./ui/UniversalIcon";

export type DropdownItem<T> = { label: string; value: T };

interface Props<T> {
  onChangeCallBack: (value: T) => void;
  data: DropdownItem<T>[];
  value: DropdownItem<T> | null;
}

export default function DropdownComponent<T>({
  onChangeCallBack,
  data,
  value,
}: Props<T>) {
  const [isFocused, setIsFocused] = useState(false);
  return (
    <Dropdown
      style={[styles.dropdown, isFocused && { borderColor: "blue" }]}
      placeholderStyle={globalStyles.smallTitle}
      selectedTextStyle={globalStyles.smallTitle}
      itemTextStyle={globalStyles.smallTitle}
      data={data}
      labelField="label"
      valueField="value"
      placeholder="Select"
      onFocus={() => setIsFocused(true)}
      onBlur={() => setIsFocused(false)}
      value={value}
      onChange={(item: DropdownItem<T>) => {
        setIsFocused(false);
        onChangeCallBack(item.value);
      }}
      renderRightIcon={() => (
        <UniversalIcon
          source={IconSource.FontAwesome6}
          name="chevron-down"
          size={20}
          color="black"
          style={{
            transform: [{ rotate: isFocused ? "180deg" : "0deg" }],
            marginRight: 5,
          }}
        />
      )}
    />
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
  },
  buttonText: {
    ...globalStyles.smallTitle,
    marginLeft: 5,
  },
  input: {
    backgroundColor: "#EFEFF3",
    borderRadius: 8,
  },
  dropdown: {
    backgroundColor: "#EFEFF3",
    borderColor: "black",
    height: 50,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 8,
  },
  button: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    minWidth: 100,
  },
  cancelButton: {
    backgroundColor: "#EFEFF3",
    borderWidth: 1,
    borderColor: "#DDD",
  },
  deleteButton: {
    backgroundColor: "#FF3B30",
  },
});
