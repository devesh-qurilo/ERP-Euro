// src/modules/admin/work/tasks/components/ui.js

import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

export const Button = ({
  title,
  onPress,
  bg = '#3B82F6',
  color = '#fff',
  icon = null,
  style,
}) => (
  <TouchableOpacity
    onPress={onPress}
    style={[
      {
        backgroundColor: bg,
        paddingHorizontal: 14,
        paddingVertical: 10,
        borderRadius: 8,
        flexDirection: 'row', // ⬅️ IMPORTANT (for icon support)
        alignItems: 'center',
        justifyContent: 'center',
        gap: 6, // ⬅️ spacing between icon & text
      },
      style,
    ]}
  >
    {icon && <View>{icon}</View>} {/* ⬅️ render icon properly */}
    {title ? <Text style={{ color, fontWeight: '700' }}>{title}</Text> : null}
  </TouchableOpacity>
);

export const Card = ({ children, style }) => (
  <View
    style={[
      {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 12,
        borderWidth: 1,
        borderColor: '#EEE',
      },
      style,
    ]}
  >
    {children}
  </View>
);

export const Col = ({ children, style }) => (
  <View
    style={[
      { paddingVertical: 10, paddingHorizontal: 12, minWidth: 160 },
      style,
    ]}
  >
    {children}
  </View>
);

export const HeaderCol = ({ children, style }) => (
  <Col
    style={[
      {
        backgroundColor: '#FAFAFA',
        borderBottomWidth: 1,
        borderColor: '#EAEAEA',
      },
      style,
    ]}
  >
    <Text style={{ fontWeight: '600', color: '#111827' }}>{children}</Text>
  </Col>
);
