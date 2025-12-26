import React, { useState } from 'react';
import { View, Text, Pressable, StyleSheet, ScrollView } from 'react-native';

const dayName = d =>
  new Date(d).toLocaleDateString(undefined, { weekday: 'long' });

export default function HolidaysTable({
  data = [],
  loading,
  onEdit,
  onDelete,
}) {
  const [openRow, setOpenRow] = useState(null);

  return (
    <View style={s.card}>
      <ScrollView horizontal showsHorizontalScrollIndicator>
        <View style={{ minWidth: 900 }}>
          {/* HEADER */}
          <View style={[s.row, s.header]}>
            <Text style={[s.cell, s.hcell, { flex: 1 }]}>Date</Text>
            <Text style={[s.cell, s.hcell, { flex: 1 }]}>Day</Text>
            <Text style={[s.cell, s.hcell, { flex: 2 }]}>Occasion</Text>
            <Text style={[s.cell, s.hcell, { width: 80 }]}>Action</Text>
          </View>

          {loading ? (
            <Text style={{ padding: 12 }}>Loading…</Text>
          ) : (
            data.map(h => (
              <View key={h.id} style={s.row}>
                <Text style={[s.cell, { flex: 1 }]}>{h.date}</Text>
                <Text style={[s.cell, { flex: 1 }]}>{dayName(h.date)}</Text>
                <Text style={[s.cell, { flex: 2 }]} numberOfLines={1}>
                  {h.occasion}
                </Text>

                {/* KEBAB */}
                <View style={[s.cell, { width: 80 }]}>
                  <Pressable
                    onPress={() => setOpenRow(openRow === h.id ? null : h.id)}
                  >
                    <Text style={s.kebab}>⋮</Text>
                  </Pressable>

                  {openRow === h.id && (
                    <View style={s.menu}>
                      <Pressable
                        style={s.menuItem}
                        onPress={() => {
                          setOpenRow(null);
                          onEdit(h);
                        }}
                      >
                        <Text>Edit</Text>
                      </Pressable>

                      <Pressable
                        style={s.menuItem}
                        onPress={() => {
                          setOpenRow(null);
                          onDelete(h.id);
                        }}
                      >
                        <Text style={{ color: '#dc2626' }}>Delete</Text>
                      </Pressable>
                    </View>
                  )}
                </View>
              </View>
            ))
          )}
        </View>
      </ScrollView>
    </View>
  );
}

/* ================= STYLES ================= */

const s = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },

  row: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },

  header: {
    backgroundColor: '#f8fafc',
  },

  cell: {
    paddingVertical: 14,
    paddingHorizontal: 12,
    color: '#111827',
    position: 'relative',
  },

  hcell: {
    fontWeight: '800',
    color: '#0b0b0c',
  },

  kebab: {
    fontSize: 20,
    fontWeight: '900',
    textAlign: 'center',
  },

  menu: {
    position: 'absolute',
    top: 32,
    right: 0,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 8,
    zIndex: 100,
    elevation: 6,
    minWidth: 120,
  },

  menuItem: {
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#f1f5f9',
  },
});
