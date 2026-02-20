// components/DealTable.js

import React, { useMemo } from 'react';
import {
  View,
  Text,
  ScrollView,
  ActivityIndicator,
  StyleSheet,
  FlatList,
} from 'react-native';
import DealRow from './DealRow';

/* ================= COLUMN CONFIG (SINGLE SOURCE OF TRUTH) ================= */

const COLUMNS = [
  { key: 'deal', label: 'Deal', width: 200 },
  { key: 'lead', label: 'Lead', width: 180 },
  { key: 'value', label: 'Value', width: 120 },
  { key: 'close', label: 'Close Date', width: 130 },
  { key: 'followup', label: 'Next Follow-up', width: 150 },
  { key: 'agent', label: 'Deal Agent', width: 180 },
  { key: 'watchers', label: 'Watchers', width: 160 },
  { key: 'stage', label: 'Stage', width: 150 },
  { key: 'priority', label: 'Priority', width: 120 },
  { key: 'tags', label: 'Tags', width: 160 },
  { key: 'actions', label: 'Actions', width: 80 },
];

const TOTAL_WIDTH = COLUMNS.reduce((sum, c) => sum + c.width, 0);

export default function DealTable({
  data = [],
  loading = false,
  busyIds = {},
  onAddFollowup,
}) {
  const keyExtractor = item => String(item.id);

  const renderItem = ({ item }) => (
    <DealRow
      item={item}
      busy={!!busyIds?.[item.id]}
      onAddFollowup={onAddFollowup}
      columns={COLUMNS} // 👈 pass width config
    />
  );

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
        <Text style={styles.emptyText}>No deals found.</Text>
      </View>
    );
  }

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator
      style={{ flex: 1 }}
      contentContainerStyle={{ paddingBottom: 20 }}
    >
      <View style={{ width: TOTAL_WIDTH }}>
        {/* ================= HEADER ================= */}
        <View style={[styles.row, styles.headerRow]}>
          {COLUMNS.map(col => (
            <View key={col.key} style={[styles.cell, { width: col.width }]}>
              <Text style={styles.headerText}>{col.label}</Text>
            </View>
          ))}
        </View>

        {/* ================= FLATLIST ================= */}
        <FlatList
          data={data.filter(Boolean)}
          keyExtractor={keyExtractor}
          renderItem={renderItem}
          showsVerticalScrollIndicator
          removeClippedSubviews
          initialNumToRender={15}
          maxToRenderPerBatch={20}
          windowSize={10}
        />
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

  emptyText: {
    color: '#6b7280',
    fontSize: 14,
  },

  row: {
    flexDirection: 'row',
    minHeight: 56,
    alignItems: 'center',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#e5e7eb',
    backgroundColor: '#fff',
  },

  headerRow: {
    backgroundColor: '#f3f4f6',
    borderTopWidth: 1,
    borderColor: '#e5e7eb',
  },

  cell: {
    paddingHorizontal: 14,
    paddingVertical: 12,
    justifyContent: 'center',
  },

  headerText: {
    fontWeight: '700',
    fontSize: 12,
    textTransform: 'uppercase',
    color: '#374151',
  },
});
