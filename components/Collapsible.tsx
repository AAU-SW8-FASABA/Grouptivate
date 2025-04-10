import { PropsWithChildren, useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';

import { IconSymbol } from '@/components/ui/IconSymbol';

export function Collapsible({ children, title }: PropsWithChildren & { title: string }) {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <View>
      <TouchableOpacity
        style={styles.heading}
        onPress={() => setIsOpen((value) => !value)}
        activeOpacity={0.8}>
        <Text style={styles.text}>{title}</Text>
        <IconSymbol
          name="chevron.right"
          size={32}
          weight="medium"
          color="black"
          style={{ transform: [{ rotate: isOpen ? '90deg' : '270deg' }] }}
        />
      </TouchableOpacity>
      {isOpen && <View style={styles.content}>{children}</View>}
    </View>
  );
}

const styles = StyleSheet.create({
  heading: {
    backgroundColor: "white",
    color: "black",
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center"
  },
  text: {
    fontFamily: "Roboto",
    fontWeight: 500,
    fontSize: 28,
  },
  content: {
    backgroundColor: "white",
  },
});
