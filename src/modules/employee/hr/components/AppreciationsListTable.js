// src/modules/employee/hr/components/AppreciationsListTable.js
import React, { useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  FlatList,
  Image,
  Pressable,
  Linking,
  Alert,
} from 'react-native';

const COLS = [
  { key: 'givenTo', label: 'Given To', width: 320 },
  { key: 'awardName', label: 'Award Name', width: 360 },
  { key: 'date', label: 'Given On', width: 180 },
  { key: 'action', label: 'Action', width: 120 },
];
const TABLE_WIDTH = COLS.reduce((s, c) => s + c.width, 0);

const awardIconByTitle = (title = '') => {
  const t = title.toLowerCase();
  if (t.includes('sde') || t.includes('developer')) return '🎖️';
  if (t.includes('manager')) return '🏆';
  if (t.includes('tester') || t.includes('qa')) return '⭐';
  if (t.includes('designer') || t.includes('ui') || t.includes('ux'))
    return '🏵️';
  return '🏅';
};
const fmt = d => {
  try {
    const x = new Date(d);
    const dd = String(x.getDate()).padStart(2, '0');
    const mm = String(x.getMonth() + 1).padStart(2, '0');
    const yy = x.getFullYear();
    return `${dd}/${mm}/${yy}`;
  } catch {
    return d;
  }
};

export default function AppreciationsListTable({ rows = [] }) {
  const data = useMemo(
    () =>
      rows.map(r => ({
        id: String(r.id),
        name: r.givenToEmployeeName || r.givenToEmployeeId,
        empId: r.givenToEmployeeId,
        avatar: r.photoUrl, // if this is not employee photo, it still looks okay; otherwise use initials fallback
        awardTitle: r.awardTitle || '—',
        icon: awardIconByTitle(r.awardTitle),
        date: fmt(r.date),
        url: r.photoUrl,
      })),
    [rows],
  );

  const renderRow = ({ item, index }) => (
    <View style={[styles.row, index % 2 ? styles.alt : null]}>
      {/* Given To */}
      <View style={[styles.cell, { width: COLS[0].width }]}>
        <View style={styles.person}>
          {item.avatar ? (
            <Image source={{ uri: item.avatar }} style={styles.avatar} />
          ) : (
            <View style={[styles.avatar, styles.avatarFallback]}>
              <Text style={{ color: '#fff', fontWeight: '800' }}>
                {(item.name || '?')
                  .split(' ')
                  .map(n => n[0])
                  .join('')
                  .slice(0, 2)
                  .toUpperCase()}
              </Text>
            </View>
          )}
          <View>
            <Text style={styles.name} numberOfLines={1}>
              {item.name}
            </Text>
            <Text style={styles.sub} numberOfLines={1}>
              {item.empId}
            </Text>
          </View>
        </View>
      </View>

      {/* Award Name */}
      <View style={[styles.cell, { width: COLS[1].width }]}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
          <Text style={styles.awardIcon}>{item.icon}</Text>
          <Text style={styles.text}>{item.awardTitle}</Text>
        </View>
      </View>

      {/* Given On */}
      <View style={[styles.cell, { width: COLS[2].width }]}>
        <Text style={styles.text}>{item.date}</Text>
      </View>

      {/* Action */}
      <View style={[styles.cell, { width: COLS[3].width }]}>
        <Pressable
          onPress={() =>
            item.url
              ? Linking.openURL(item.url).catch(() =>
                  Alert.alert('Open failed'),
                )
              : Alert.alert(
                  'Details',
                  `${item.name}\n${item.awardTitle}\n${item.date}`,
                )
          }
          style={styles.eyeBtn}
        >
          <Text style={styles.eyeTxt}>👁️</Text>
        </Pressable>
      </View>
    </View>
  );

  return (
    <View style={styles.card}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator
        contentContainerStyle={{ minWidth: TABLE_WIDTH }}
      >
        <View style={{ width: TABLE_WIDTH }}>
          <View style={[styles.row, styles.headRow]}>
            {COLS.map(c => (
              <View key={c.key} style={[styles.cell, { width: c.width }]}>
                <Text style={[styles.text, styles.head]}>{c.label}</Text>
              </View>
            ))}
          </View>
          <FlatList
            data={data}
            keyExtractor={it => it.id}
            renderItem={renderRow}
            nestedScrollEnabled
            contentContainerStyle={{ paddingBottom: 10 }}
          />
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 10,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 6 },
    elevation: 2,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#e5e7eb',
    minHeight: 60,
    paddingHorizontal: 6,
  },
  headRow: {
    backgroundColor: '#e8f1ff',
    borderBottomWidth: 0,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  alt: { backgroundColor: '#fafbfc' },
  cell: { justifyContent: 'center', paddingVertical: 12, paddingRight: 8 },

  person: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#e5e7eb',
  },
  avatarFallback: {
    backgroundColor: '#7c3aed',
    alignItems: 'center',
    justifyContent: 'center',
  },
  name: { fontSize: 16, fontWeight: '800', color: '#1f2328' },
  sub: { fontSize: 13, color: '#6b7280' },

  awardIcon: { fontSize: 20 },
  text: { fontSize: 16, color: '#1f2328' },
  head: { fontWeight: '900', color: '#374151' },

  eyeBtn: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: '#e5e7eb',
    backgroundColor: '#fff',
  },
  eyeTxt: { fontSize: 16 },
});
