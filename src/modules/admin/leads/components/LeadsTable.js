// src/modules/admin/leads/components/LeadsTable.js
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Pressable,
} from 'react-native';

export default function LeadsTable({ data, loading, busyIds, onRowMenuPress }) {
  // console.log('devesh kumar ', data);
  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator />
      </View>
    );
  }

  const COLUMNS = [
    { key: 'name', width: 180 },
    { key: 'company', width: 200 },
    { key: 'email', width: 220 },
    { key: 'mobile', width: 140 },
    { key: 'source', width: 120 },
    { key: 'owner', width: 140 },
    { key: 'actions', width: 80 },
  ];

  const TOTAL_WIDTH = COLUMNS.reduce((sum, c) => sum + c.width, 0);

  if (!loading && (!data || data.length === 0)) {
    return (
      <View style={styles.center}>
        <Text style={styles.emptyTxt}>No leads found.</Text>
      </View>
    );
  }

  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
      <View style={{ width: TOTAL_WIDTH }}>
        {/* Header */}
        <View style={[styles.row, styles.headerRow]}>
          <Text
            style={[
              styles.cell,
              styles.headerCell,
              { width: COLUMNS[0].width },
            ]}
          >
            Name
          </Text>
          <Text
            style={[
              styles.cell,
              styles.headerCell,
              { width: COLUMNS[1].width },
            ]}
          >
            Company
          </Text>
          <Text
            style={[
              styles.cell,
              styles.headerCell,
              { width: COLUMNS[2].width },
            ]}
          >
            Email
          </Text>
          <Text
            style={[
              styles.cell,
              styles.headerCell,
              { width: COLUMNS[3].width },
            ]}
          >
            Mobile
          </Text>
          <Text
            style={[
              styles.cell,
              styles.headerCell,
              { width: COLUMNS[4].width },
            ]}
          >
            Source
          </Text>
          <Text
            style={[
              styles.cell,
              styles.headerCell,
              { width: COLUMNS[5].width },
            ]}
          >
            Owner
          </Text>
          <Text
            style={[
              styles.cell,
              styles.headerCell,
              { width: COLUMNS[6].width },
            ]}
          >
            {' '}
            Action
          </Text>
        </View>

        {data.map(item => {
          const busy = !!busyIds?.[item.id];

          return (
            <View key={item.id} style={styles.row}>
              <Text
                style={[styles.cell, { width: COLUMNS[0].width }]}
                numberOfLines={1}
                ellipsizeMode="tail"
              >
                {item.name}
              </Text>

              <Text
                style={[styles.cell, { width: COLUMNS[1].width }]}
                numberOfLines={1}
                ellipsizeMode="tail"
              >
                {item.companyName || '-'}
              </Text>

              <Text
                style={[styles.cell, { width: COLUMNS[2].width }]}
                numberOfLines={1}
                ellipsizeMode="tail"
              >
                {item.email || '-'}
              </Text>

              <Text
                style={[styles.cell, { width: COLUMNS[3].width }]}
                numberOfLines={1}
                ellipsizeMode="tail"
              >
                {item.mobileNumber || '-'}
              </Text>

              <Text
                style={[styles.cell, { width: COLUMNS[4].width }]}
                numberOfLines={1}
                ellipsizeMode="tail"
              >
                {item.leadSource || '-'}
              </Text>

              <Text
                style={[styles.cell, { width: COLUMNS[5].width }]}
                numberOfLines={1}
                ellipsizeMode="tail"
              >
                {item.name || '-'}
              </Text>

              <View
                style={[
                  styles.cell,
                  { width: COLUMNS[6].width, alignItems: 'flex-center' },
                ]}
              >
                {busy ? (
                  <ActivityIndicator size="small" />
                ) : (
                  <Pressable
                    style={styles.dotBtn}
                    onPress={() => onRowMenuPress?.(item)}
                  >
                    <Text style={styles.dotIcon}>⋮</Text>
                  </Pressable>
                )}
              </View>
            </View>
          );
        })}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  center: {
    paddingVertical: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyTxt: {
    color: '#6b7280',
    fontSize: 14,
  },
  row: {
    flexDirection: 'row',
    minHeight: 44,
    alignItems: 'center',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#e5e7eb',
    backgroundColor: '#fff',
  },
  headerRow: {
    backgroundColor: '#f9fafb',
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  cell: {
    paddingHorizontal: 10,
    paddingVertical: 8,
    fontSize: 13,
    color: '#111827',
  },
  headerCell: {
    fontWeight: '800',
    color: '#374151',
  },
  actionsCol: {
    minWidth: 60,
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
  dotBtn: {
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: 999,
  },
  dotIcon: {
    fontSize: 24,
    fontWeight: '900',
    color: '#0c1015',
  },
  cell: {
    paddingHorizontal: 10,
    paddingVertical: 8,
    fontSize: 13,
    color: '#111827',
    overflow: 'hidden',
  },
});
