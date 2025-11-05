// modules/admin/hr/employees/view/work/projects/components/ProjectsTable.js
import React from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';

const statuses = [
  'PLANNED',
  'IN_PROGRESS',
  'ON_HOLD',
  'COMPLETED',
  'CANCELLED',
  'ARCHIVED',
];

const TinySelect = ({ value, onChange }) => {
  const [open, setOpen] = React.useState(false);
  return (
    <View style={{ position: 'relative' }}>
      <Pressable style={styles.ddBtn} onPress={() => setOpen(o => !o)}>
        <Text style={styles.ddTxt}>{value || '—'}</Text>
        <Text style={styles.ddCaret}>{open ? '▴' : '▾'}</Text>
      </Pressable>
      {open && (
        <View style={styles.ddMenu}>
          {statuses.map(s => (
            <Pressable
              key={s}
              style={styles.ddItem}
              onPress={() => {
                onChange(s);
                setOpen(false);
              }}
            >
              <Text style={styles.ddItemTxt}>{s}</Text>
            </Pressable>
          ))}
        </View>
      )}
    </View>
  );
};

const RowHead = ({ cols, widths }) => (
  <View style={[styles.tr, styles.head]}>
    {cols.map((c, i) => (
      <View key={c} style={[styles.cell, { width: widths[i] }]}>
        <Text style={styles.headTxt}>{c}</Text>
      </View>
    ))}
  </View>
);
const Row = ({ children }) => (
  <View style={[styles.tr, styles.row]}>{children}</View>
);
const Cell = ({ w, children, text }) => (
  <View style={[styles.cell, { width: w }]}>
    {children ?? (
      <Text style={styles.body} numberOfLines={2}>
        {text}
      </Text>
    )}
  </View>
);

export default function ProjectsTable({
  data = [],
  loading,
  onEdit,
  onDelete,
  onStatusChange,
}) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      style={styles.wrap}
    >
      <View style={styles.table}>
        <RowHead
          cols={[
            'Code',
            'Project',
            'Start',
            'Deadline',
            'Category',
            'Budget',
            'Hours',
            'Status',
            'Actions',
          ]}
          widths={[140, 240, 160, 160, 160, 120, 100, 160, 140]}
        />
        {(loading ? [] : data).map(p => (
          <Row key={p.id}>
            <Cell w={140} text={p.shortCode || '—'} />
            <Cell w={240} text={p.name} />
            <Cell w={160} text={p.startDate || '—'} />
            <Cell
              w={160}
              text={p.deadline || (p.noDeadline ? 'No deadline' : '—')}
            />
            <Cell w={160} text={p.category || '—'} />
            <Cell w={120} text={`${p.currency || ''} ${p.budget ?? '—'}`} />
            <Cell w={100} text={String(p.hoursEstimate ?? '—')} />
            <Cell w={160}>
              <TinySelect
                value={p.projectStatus || 'PLANNED'}
                onChange={status => onStatusChange(p.id, status)}
              />
            </Cell>
            <Cell w={140}>
              <View style={{ flexDirection: 'row', gap: 8 }}>
                <Pressable style={styles.actBtn} onPress={() => onEdit(p)}>
                  <Text style={styles.actTxt}>Edit</Text>
                </Pressable>
                <Pressable
                  style={[
                    styles.actBtn,
                    { backgroundColor: '#fee2e2', borderColor: '#fecaca' },
                  ]}
                  onPress={() => onDelete(p.id)}
                >
                  <Text style={[styles.actTxt, { color: '#b91c1c' }]}>
                    Delete
                  </Text>
                </Pressable>
              </View>
            </Cell>
          </Row>
        ))}
        {loading && (
          <Text style={{ padding: 10, color: '#6b7280' }}>Loading…</Text>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  wrap: { marginTop: 6 },
  table: {
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 12,
    overflow: 'hidden',
  },
  tr: { flexDirection: 'row' },
  head: { backgroundColor: '#e8f0ff' },
  headTxt: { fontWeight: '900', color: '#374151' },
  row: { borderTopWidth: 1, borderColor: '#f1f5f9' },
  cell: {
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderRightWidth: 1,
    borderColor: '#f1f5f9',
    justifyContent: 'center',
  },
  body: { color: '#111827' },

  actBtn: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    backgroundColor: '#fff',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  actTxt: { color: '#111827', fontWeight: '700' },

  ddBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    backgroundColor: '#fff',
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 10,
  },
  ddTxt: { color: '#111827', flex: 1 },
  ddCaret: { color: '#6b7280' },
  ddMenu: {
    position: 'absolute',
    top: 42,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    overflow: 'hidden',
    zIndex: 20,
  },
  ddItem: {
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#f1f5f9',
  },
  ddItemTxt: { color: '#111827' },
});
