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
  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator />
      </View>
    );
  }

  if (!loading && (!data || data.length === 0)) {
    return (
      <View style={styles.center}>
        <Text style={styles.emptyTxt}>No leads found.</Text>
      </View>
    );
  }

  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
      <View>
        {/* Header */}
        <View style={[styles.row, styles.headerRow]}>
          <Text style={[styles.cell, styles.headerCell, { minWidth: 180 }]}>
            Name
          </Text>
          <Text style={[styles.cell, styles.headerCell, { minWidth: 200 }]}>
            Company
          </Text>
          <Text style={[styles.cell, styles.headerCell, { minWidth: 200 }]}>
            Email
          </Text>
          <Text style={[styles.cell, styles.headerCell, { minWidth: 140 }]}>
            Mobile
          </Text>
          <Text style={[styles.cell, styles.headerCell, { minWidth: 120 }]}>
            Source
          </Text>
          <Text style={[styles.cell, styles.headerCell, { minWidth: 120 }]}>
            Owner
          </Text>
          <Text style={[styles.cell, styles.headerCell, styles.actionsCol]} />
        </View>

        {/* Rows */}
        {data.map(item => {
          const busy = !!busyIds?.[item.id];
          return (
            <View key={item.id} style={styles.row}>
              <Text style={[styles.cell, { minWidth: 180 }]} numberOfLines={1}>
                {item.name}
              </Text>
              <Text style={[styles.cell, { minWidth: 200 }]} numberOfLines={1}>
                {item.companyName || '-'}
              </Text>
              <Text style={[styles.cell, { minWidth: 200 }]} numberOfLines={1}>
                {item.email || '-'}
              </Text>
              <Text style={[styles.cell, { minWidth: 140 }]} numberOfLines={1}>
                {item.mobileNumber || '-'}
              </Text>
              <Text style={[styles.cell, { minWidth: 120 }]} numberOfLines={1}>
                {item.leadSource || '-'}
              </Text>
              <Text style={[styles.cell, { minWidth: 120 }]} numberOfLines={1}>
                {item.leadOwner || '-'}
              </Text>

              <View style={[styles.cell, styles.actionsCol]}>
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
    fontSize: 18,
    fontWeight: '900',
    color: '#4b5563',
  },
});
