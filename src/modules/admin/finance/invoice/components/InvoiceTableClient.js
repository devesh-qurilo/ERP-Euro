import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Pressable,
  ActivityIndicator,
} from 'react-native';
import ActionMenu from './ActionMenu';

const asArray = v => (Array.isArray(v) ? v : []);

export default function InvoicesTable({
  data,
  loading = false,
  busyIds,
  showClientColumn = true,

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

  const [menuItem, setMenuItem] = useState(null);
  const [menuVisible, setMenuVisible] = useState(false);

  const openMenu = item => {
    setMenuItem(item);
    setMenuVisible(true);
  };

  const closeMenu = () => {
    setMenuVisible(false);
    setMenuItem(null);
  };

  if (loading) {
    return <ActivityIndicator style={{ marginTop: 16 }} />;
  }

  return (
    <>
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
              const key = String(
                row?.id ?? row?.invoiceNumber ?? Math.random(),
              );

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
                  <Cell text={invoiceNumber} w={160} />
                  <Cell text={invoiceDate} w={140} />

                  {showClientColumn && <Cell text={clientName} w={220} />}

                  <Cell text={projectName} w={220} />
                  <Cell text={currency} w={120} />
                  <Cell text={Number(amount).toFixed(2)} w={140} />
                  <Cell text={Number(tax).toFixed(2)} w={140} />
                  <Cell text={Number(discount).toFixed(2)} w={140} />
                  <Cell text={Number(total).toFixed(2)} w={140} />
                  <Cell text={status} w={140} />

                  {/* ACTION BUTTON */}
                  <View style={[styles.cell, styles.actionsCenter]}>
                    <Pressable
                      onPress={() => openMenu(row)}
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

      {/* ACTION MENU */}
      <ActionMenu
        visible={menuVisible}
        row={menuItem}
        onClose={closeMenu}
        onSelect={(action, row) => {
          closeMenu();

          const actionsMap = {
            View: () => onView?.(row),
            Edit: () => onEdit?.(row),
            Delete: () => onDelete?.(row),
            'Mark as paid': () => onMarkPaid?.(row),
            'Add payment': () => onAddPayment?.(row),
            'View payment': () => onViewPayments?.(row),
            'Payment reminder': () => onPaymentReminder?.(row),
            'View receipt': () => onViewReceipts?.(row),
            'Upload file': () => onUploadFile?.(row),
            'Delete file': () => onDeleteFile?.(row),
            // 'Create duplicate': () => onDuplicate?.(row),
          };

          actionsMap[action]?.();
        }}
      />
    </>
  );
}

/* ================= SMALL COMPONENTS ================= */

const Header = ({ text, w }) => (
  <Text style={[styles.cell, styles.hcell, { minWidth: w }]}>{text}</Text>
);

const Cell = ({ text, w }) => (
  <Text style={[styles.cell, { minWidth: w }]} numberOfLines={1}>
    {text}
  </Text>
);

/* ================= STYLES ================= */

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
