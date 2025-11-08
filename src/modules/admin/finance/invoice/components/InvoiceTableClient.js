// src/modules/admin/finance/invoice/components/InvoicesTable.js
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
const isArr = Array.isArray;

export default function InvoicesTable({
  data,
  loading = false,
  busyIds,
  showClientColumn = true,

  // action handlers
  onView,
  onEdit,
  onDelete,
  onMarkPaid,
  onPaymentReminder,
  onAddPayment,
  onViewPayments,
  onViewReceipts,
  onUploadFile,
  onDeleteFile,
  onDuplicate,
}) {
  const rows = asArray(data);
  const busy = asArray(busyIds);

  if (loading) return <ActivityIndicator style={{ marginTop: 16 }} />;

  return (
    <ScrollView horizontal bounces style={styles.hscroll}>
      <View style={styles.table}>
        {/* Header */}
        <View style={[styles.row, styles.head]}>
          <Text style={[styles.cell, styles.hcell, { minWidth: 160 }]}>
            Invoice #
          </Text>
          <Text style={[styles.cell, styles.hcell, { minWidth: 140 }]}>
            Date
          </Text>
          {showClientColumn && (
            <Text style={[styles.cell, styles.hcell, { minWidth: 220 }]}>
              Client
            </Text>
          )}
          <Text style={[styles.cell, styles.hcell, { minWidth: 220 }]}>
            Project
          </Text>
          <Text style={[styles.cell, styles.hcell, { minWidth: 120 }]}>
            Currency
          </Text>
          <Text style={[styles.cell, styles.hcell, { minWidth: 140 }]}>
            Amount
          </Text>
          <Text style={[styles.cell, styles.hcell, { minWidth: 140 }]}>
            Tax
          </Text>
          <Text style={[styles.cell, styles.hcell, { minWidth: 140 }]}>
            Discount
          </Text>
          <Text style={[styles.cell, styles.hcell, { minWidth: 140 }]}>
            Total
          </Text>
          <Text style={[styles.cell, styles.hcell, { minWidth: 140 }]}>
            Status
          </Text>
          <Text style={[styles.cell, styles.hcell, { minWidth: 320 }]}>
            Actions
          </Text>
        </View>

        {/* Rows */}
        {rows.map(row => {
          const key = String(row?.id ?? row?.invoiceNumber ?? Math.random());
          const disabled = busy.includes(row?.id);

          const invoiceNumber = row?.invoiceNumber ?? '—';
          const invoiceDate = row?.invoiceDate ?? '—';
          const clientName = row?.client?.name ?? row?.clientId ?? '—';
          const projectName = row?.project?.projectName ?? '—';
          const currency = row?.currency ?? row?.project?.currency ?? '—';
          const amount = row?.amount ?? 0;
          const tax = row?.tax ?? 0;
          const discount = row?.discount ?? 0;
          const total = row?.total ?? 0;
          const status = row?.status ?? '—';

          return (
            <View key={key} style={styles.row}>
              <Text style={[styles.cell, { minWidth: 160 }]} numberOfLines={1}>
                {invoiceNumber}
              </Text>
              <Text style={[styles.cell, { minWidth: 140 }]} numberOfLines={1}>
                {invoiceDate}
              </Text>
              {showClientColumn && (
                <Text
                  style={[styles.cell, { minWidth: 220 }]}
                  numberOfLines={1}
                >
                  {clientName}
                </Text>
              )}
              <Text style={[styles.cell, { minWidth: 220 }]} numberOfLines={1}>
                {projectName}
              </Text>
              <Text style={[styles.cell, { minWidth: 120 }]}>{currency}</Text>
              <Text style={[styles.cell, { minWidth: 140 }]}>
                {Number(amount).toFixed(2)}
              </Text>
              <Text style={[styles.cell, { minWidth: 140 }]}>
                {Number(tax).toFixed(2)}
              </Text>
              <Text style={[styles.cell, { minWidth: 140 }]}>
                {Number(discount).toFixed(2)}
              </Text>
              <Text style={[styles.cell, { minWidth: 140 }]}>
                {Number(total).toFixed(2)}
              </Text>
              <Text style={[styles.cell, { minWidth: 140 }]}>{status}</Text>

              {/* Actions */}
              <View style={[styles.cell, styles.actions]}>
                <RowBtn
                  label="View"
                  onPress={() => onView?.(row)}
                  disabled={disabled}
                />
                <RowBtn
                  label="Edit"
                  onPress={() => onEdit?.(row)}
                  disabled={disabled}
                />
                <RowBtn
                  label="Delete"
                  onPress={() => onDelete?.(row)}
                  danger
                  disabled={disabled}
                />

                {/* Status-based actions */}
                {status === 'UNPAID' && (
                  <>
                    <RowBtn
                      label="Mark Paid"
                      onPress={() => onMarkPaid?.(row)}
                      disabled={disabled}
                    />
                    <RowBtn
                      label="Add Payment"
                      onPress={() => onAddPayment?.(row)}
                      disabled={disabled}
                    />
                    <RowBtn
                      label="Reminder"
                      onPress={() => onPaymentReminder?.(row)}
                      disabled={disabled}
                    />
                  </>
                )}

                {status === 'PAID' && (
                  <>
                    <RowBtn
                      label="View Payments"
                      onPress={() => onViewPayments?.(row)}
                      disabled={disabled}
                    />
                    <RowBtn
                      label="View Receipts"
                      onPress={() => onViewReceipts?.(row)}
                      disabled={disabled}
                    />
                  </>
                )}

                {/* Common */}
                <RowBtn
                  label="Duplicate"
                  onPress={() => onDuplicate?.(row)}
                  disabled={disabled}
                />
              </View>
            </View>
          );
        })}
      </View>
    </ScrollView>
  );
}

function RowBtn({ label, onPress, disabled, danger }) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={({ pressed }) => [
        styles.btn,
        danger && styles.btnDanger,
        disabled && { opacity: 0.6 },
        pressed && { opacity: 0.85 },
      ]}
    >
      <Text style={[styles.btnTxt, danger && { color: '#b91c1c' }]}>
        {label}
      </Text>
    </Pressable>
  );
}

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
  cell: { paddingVertical: 12, paddingHorizontal: 12, minWidth: 120 },
  hcell: { fontWeight: '800', color: '#111827' },

  actions: {
    minWidth: 320,
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
  btnDanger: {
    borderColor: '#fecaca',
    backgroundColor: '#fff1f2',
  },
  btnTxt: { fontSize: 12, color: '#111827' },
});
