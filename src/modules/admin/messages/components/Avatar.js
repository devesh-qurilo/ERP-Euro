// Avatar.js
import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';

export default function Avatar({ uri, name, size = 52, style }) {
  const initials = (name || 'U')
    .split(' ')
    .map(p => p[0])
    .slice(0, 2)
    .join('');
  if (uri) {
    return (
      <Image
        source={{ uri }}
        style={[{ width: size, height: size, borderRadius: size / 2 }, style]}
      />
    );
  }
  return (
    <View
      style={[
        styles.placeholder,
        { width: size, height: size, borderRadius: size / 2 },
        style,
      ]}
    >
      <Text style={[styles.initials, { fontSize: Math.round(size / 2.8) }]}>
        {initials}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  placeholder: {
    backgroundColor: '#E6EEF8',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#EFF6FF',
  },
  initials: {
    color: '#2563EB',
    fontWeight: '800',
  },
});
