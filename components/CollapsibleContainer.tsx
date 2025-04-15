import React, { useState } from 'react';
import { StyleSheet, View, TouchableOpacity } from 'react-native';

import { HR } from './HR';
import { IconSource, UniversalIcon } from "@/components/ui/UniversalIcon";

export function CollapsibleContainer({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [child1, child2] = React.Children.toArray(children);

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.collapse}
        onPress={() => setIsOpen((value) => !value)}
        activeOpacity={0.8}>
        <UniversalIcon
          source={IconSource.FontAwesome6}
          name={"chevron-right"}
          size={20}
          color="black"
          style={{ transform: [{ rotate: isOpen ? '270deg' : '90deg' }], marginTop: 5, marginRight: 5 }}
        />
      </TouchableOpacity>
        {child1}
        {isOpen && <>
          <HR/>
          <View>{child2}</View>
        </>}
    </View>
  );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: "column",
        backgroundColor: "#EFEFF3",
        width: "100%",
        borderRadius: 5,
        marginTop: 10,
        padding: 10,
        flex: 1,
    },
    collapse: {
      position: "absolute",
      top: 8,
      right: 10,
      zIndex: 99,
    }
});
