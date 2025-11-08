import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  ActivityIndicator,
  Linking,
} from 'react-native';

export default function CreditNotesTable({
  data = [],
  loading,
  busyIds = [],
  onView,
  onEdit,
  onDelete,
}) {
  if (loading) return <ActivityIndicator style={{ marginTop: 20 }} />;

  return (
    <ScrollView horizontal style={s.hscroll}>
      <View style={s.table}>
        <View style={[s.row, s.head]}>
          {[
            'CN No.',
            'Date',
            'Currency',
            'Amount',
            'Tax %',
            'Adj.',
            'Client',
            'Project',
            'Actions',
          ].map(h => (
            <Text key={h} style={[s.cell, s.hcell]}>
              {h}
            </Text>
          ))}
        </View>
        {data.map(item => {
          const busy = busyIds.includes(item.id);
          return (
            <View key={item.id} style={s.row}>
              <Text style={s.cell}>{item.creditNoteNumber}</Text>
              <Text style={s.cell}>{item.creditNoteDate}</Text>
              <Text style={s.cell}>{item.currency}</Text>
              <Text style={s.cell}>{Number(item.amount).toFixed(2)}</Text>
              <Text style={s.cell}>{item.tax ?? '—'}</Text>
              <Text style={s.cell}>
                {item.adjustmentPositive ? '+' : '-'}
                {Number(item.adjustment || 0).toFixed(2)}
              </Text>
              <Text style={[s.cell, { minWidth: 180 }]} numberOfLines={1}>
                {item.client?.name || '—'}
              </Text>
              <Text style={[s.cell, { minWidth: 180 }]} numberOfLines={1}>
                {item.project?.projectName || '—'}
              </Text>

              <View style={[s.cell, s.actions]}>
                <Pressable onPress={() => onView?.(item)} style={s.btn}>
                  <Text>👁️</Text>
                </Pressable>
                <Pressable onPress={() => onEdit?.(item)} style={s.btn}>
                  <Text>✏️</Text>
                </Pressable>
                <Pressable
                  disabled={busy}
                  onPress={() => onDelete?.(item)}
                  style={s.btn}
                >
                  <Text>🗑️</Text>
                </Pressable>
                {item.fileUrl ? (
                  <Pressable
                    onPress={() => Linking.openURL(item.fileUrl)}
                    style={s.btn}
                  >
                    <Text>⬇️</Text>
                  </Pressable>
                ) : null}
              </View>
            </View>
          );
        })}
      </View>
    </ScrollView>
  );
}

const s = StyleSheet.create({
  hscroll: {
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    backgroundColor: '#fff',
  },
  table: { minWidth: 1000 },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  head: { backgroundColor: '#f8fafc' },
  cell: { paddingVertical: 12, paddingHorizontal: 12, minWidth: 140 },
  hcell: { fontWeight: '800', color: '#111827' },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    minWidth: 220,
  },
  btn: {
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 8,
    backgroundColor: '#fff',
  },
});
