import React from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView } from 'react-native';

const Select = ({ value, options, onChange }) => {
  const [open, setOpen] = React.useState(false);
  return (
    <View style={{ minWidth: 160 }}>
      <Pressable style={styles.select} onPress={() => setOpen(o => !o)}>
        <Text style={styles.value} numberOfLines={1}>
          {value}
        </Text>
        <Text style={styles.caret}>{open ? '▴' : '▾'}</Text>
      </Pressable>
      {open && (
        <View style={styles.menu}>
          {options.map(opt => (
            <Pressable
              key={String(opt.value)}
              style={styles.menuItem}
              onPress={() => {
                onChange(opt.value);
                setOpen(false);
              }}
            >
              <Text style={styles.menuTxt}>{opt.label}</Text>
            </Pressable>
          ))}
        </View>
      )}
    </View>
  );
};

export default function HierarchyView({ items = [], onChangeParent }) {
  // simple tree render (indent by parent)
  // parent change via dropdown
  const options = [
    { label: '— None —', value: null },
    ...items.map(x => ({
      label: `${x.designationName} (#${x.id})`,
      value: x.id,
    })),
  ];

  return (
    <ScrollView style={styles.wrap} contentContainerStyle={{ padding: 8 }}>
      {items.map(node => {
        const parentLabel =
          node.parentDesignationName ||
          (node.parentDesignationId ? `#${node.parentDesignationId}` : 'None');
        return (
          <View key={node.id} style={styles.item}>
            <View style={{ flex: 1 }}>
              <Text style={styles.title}>{node.designationName}</Text>
              <Text style={styles.dim}>
                ID: #{node.id} • Created: {node.createDate || '—'}
              </Text>
            </View>
            <View style={{ width: 12 }} />
            <View style={{ minWidth: 160 }}>
              <Text style={styles.label}>Parent</Text>
              <Select
                value={parentLabel}
                options={options.filter(o => o.value !== node.id)} // cannot select self
                onChange={val => onChangeParent(node, val)}
              />
            </View>
          </View>
        );
      })}
      {!items.length && <Text style={styles.dim}>No designations</Text>}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  wrap: {
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  title: { fontSize: 16, fontWeight: '900', color: '#0b0b0c' },
  dim: { color: '#64748b' },
  label: { fontSize: 12, fontWeight: '800', color: '#374151', marginBottom: 6 },

  select: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: '#fff',
  },
  value: { flex: 1, color: '#111827' },
  caret: { color: '#6b7280' },
  menu: {
    marginTop: 4,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 10,
    overflow: 'hidden',
  },
  menuItem: {
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#f1f5f9',
  },
  menuTxt: { color: '#111827' },
});
