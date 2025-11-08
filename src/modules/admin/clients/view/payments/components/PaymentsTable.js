import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Pressable,
  ActivityIndicator,
  Linking,
} from 'react-native';

const asArr = v => (Array.isArray(v) ? v : []);

export default function PaymentsTable({
  data,
  loading,
  busyIds,

  onView,
  onEdit,
  onDelete,
  onDownload, // uses receiptFileUrl
}) {
  const rows = asArr(data);
  const busy = asArr(busyIds);

  if (loading) return <ActivityIndicator style={{ marginTop: 16 }} />;

  return (
    <ScrollView horizontal style={s.hscroll}>
      <View style={s.table}>
        {/* header */}
        <View style={[s.row, s.head]}>
          {[
            'TXN ID',
            'Status',
            'Amount',
            'Currency',
            'Gateway',
            'Date',
            'Project',
            'Invoice #',
            'Client',
            'Actions',
          ].map(h => (
            <Text key={h} style={[s.cell, s.hcell]}>
              {h}
            </Text>
          ))}
        </View>

        {/* rows */}
        {rows.map((r, i) => {
          const disabled = busy.includes(r.id);
          return (
            <View key={`${r.id}-${i}`} style={s.row}>
              <Text style={s.cell}>{r.transactionId || '—'}</Text>
              <Text style={s.cell}>{r.status || '—'}</Text>
              <Text style={s.cell}>{Number(r.amount ?? 0).toFixed(2)}</Text>
              <Text style={s.cell}>{r.currency || '—'}</Text>
              <Text style={s.cell}>{r.paymentGateway?.name || '—'}</Text>
              <Text style={s.cell}>{r.paymentDate || '—'}</Text>
              <Text style={s.cell}>{r.project?.projectName || '—'}</Text>
              <Text style={s.cell}>{r.invoice?.invoiceNumber || '—'}</Text>
              <Text style={s.cell}>{r.client?.name || '—'}</Text>

              <View style={[s.cell, s.actions]}>
                <Btn
                  label="View"
                  onPress={() => onView?.(r)}
                  disabled={disabled}
                />
                <Btn
                  label="Edit"
                  onPress={() => onEdit?.(r)}
                  disabled={disabled}
                />
                <Btn
                  label="Delete"
                  onPress={() => onDelete?.(r)}
                  danger
                  disabled={disabled}
                />
                {!!r.receiptFileUrl && (
                  <Btn
                    label="Download"
                    onPress={() => onDownload?.(r)}
                    disabled={disabled}
                  />
                )}
              </View>
            </View>
          );
        })}
      </View>
    </ScrollView>
  );
}

function Btn({ label, onPress, disabled, danger }) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={[s.btn, danger && s.btnDanger, disabled && { opacity: 0.6 }]}
    >
      <Text style={[s.btnTxt, danger && { color: '#b91c1c' }]}>{label}</Text>
    </Pressable>
  );
}

const s = StyleSheet.create({
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
  cell: { paddingVertical: 12, paddingHorizontal: 12, minWidth: 140 },
  hcell: { fontWeight: '800', color: '#111827' },
  actions: {
    minWidth: 360,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    alignItems: 'center',
  },
  btn: {
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 6,
    backgroundColor: '#fff',
  },
  btnDanger: { borderColor: '#fecaca', backgroundColor: '#fff1f2' },
  btnTxt: { fontSize: 12, color: '#111827' },
});
