import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Pressable,
  ActivityIndicator,
} from 'react-native';

const asArray = v => (Array.isArray(v) ? v : []);

export default function InvoicesTableClient({
  data,
  loading = false,
  showClientColumn = true,
  onOpenActions,
}) {
  const rows = asArray(data);

  if (loading) {
    return <ActivityIndicator style={{ marginTop: 16 }} />;
  }

  return (
    <ScrollView horizontal bounces style={styles.hscroll}>
      <View style={styles.table}>
        {/* HEADER */}
        <View style={[styles.row, styles.head]}>
          <Header text="Invoice #" w={160} />
          <Header text="Date" w={140} />
          {showClientColumn && <Header text="Client" w={220} />}
          <Header text="Project" w={220} />
          <Header text="Currency" w={120} />
          <Header text="Amount" w={140} />
          <Header text="Tax" w={140} />
          <Header text="Discount" w={140} />
          <Header text="Total" w={140} />
          <Header text="Status" w={140} />
          <Header text="Actions" w={120} />
        </View>

        {/* ROWS */}
        {rows.length ? (
          rows.map(row => {
            const key = String(row?.id ?? row?.invoiceNumber ?? Math.random());

            return (
              <View key={key} style={styles.row}>
                <Cell text={row?.invoiceNumber ?? '—'} w={160} />
                <Cell text={row?.invoiceDate ?? '—'} w={140} />

                {showClientColumn && (
                  <Cell text={row?.client?.name ?? '—'} w={220} />
                )}

                <Cell text={row?.project?.projectName ?? '—'} w={220} />
                <Cell
                  text={row?.currency ?? row?.project?.currency ?? '—'}
                  w={120}
                />
                <Cell text={Number(row?.amount ?? 0).toFixed(2)} w={140} />
                <Cell text={Number(row?.tax ?? 0).toFixed(2)} w={140} />
                <Cell text={Number(row?.discount ?? 0).toFixed(2)} w={140} />
                <Cell text={Number(row?.total ?? 0).toFixed(2)} w={140} />
                <Cell text={row?.status ?? '—'} w={140} />

                {/* ACTION BUTTON */}
                <View style={[styles.cell, styles.actionsCenter]}>
                  <Pressable
                    onPress={() => onOpenActions?.(row)}
                    style={styles.dotBtn}
                  >
                    <Text style={{ fontSize: 18 }}>⋯</Text>
                  </Pressable>
                </View>
              </View>
            );
          })
        ) : (
          <View style={{ padding: 16 }}>
            <Text style={{ color: '#6b7280' }}>No invoices found</Text>
          </View>
        )}
      </View>
    </ScrollView>
  );
}

/* ===== SMALL COMPONENTS ===== */

const Header = ({ text, w }) => (
  <Text style={[styles.cell, styles.hcell, { minWidth: w }]}>{text}</Text>
);

const Cell = ({ text, w }) => (
  <Text style={[styles.cell, { minWidth: w }]} numberOfLines={1}>
    {text}
  </Text>
);

/* ===== STYLES ===== */

const styles = StyleSheet.create({
  hscroll: {
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    backgroundColor: '#fff',
  },

  table: { minWidth: 1200 },

  row: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },

  head: { backgroundColor: '#f8fafc' },

  cell: {
    paddingVertical: 12,
    paddingHorizontal: 12,
    minWidth: 120,
  },

  hcell: {
    fontWeight: '800',
    color: '#111827',
  },

  actionsCenter: {
    minWidth: 120,
    alignItems: 'center',
    justifyContent: 'center',
  },

  dotBtn: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 8,
    backgroundColor: '#fff',
  },
});
