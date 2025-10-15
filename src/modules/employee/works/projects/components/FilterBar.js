import React from 'react';
import {
  View,
  TextInput,
  ScrollView,
  Pressable,
  Text,
  StyleSheet,
} from 'react-native';

const Chip = ({ label, active, onPress }) => (
  <Pressable
    onPress={onPress}
    style={[styles.chip, active && styles.chipActive]}
  >
    <Text style={[styles.chipText, active && styles.chipTextActive]}>
      {label}
    </Text>
  </Pressable>
);

export default function FilterBar({
  q,
  setQ,
  category,
  setCategory,
  categories,
  client,
  setClient,
  clients,
}) {
  return (
    <View style={styles.wrap}>
      <TextInput
        placeholder="Search by name, code, summary"
        placeholderTextColor="#94A3B8"
        value={q}
        onChangeText={setQ}
        style={styles.search}
      />
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.row}
      >
        {categories.map(cat => (
          <Chip
            key={`cat-${cat}`}
            label={cat}
            active={category === cat}
            onPress={() => setCategory(cat)}
          />
        ))}
      </ScrollView>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.row}
      >
        {clients.map(c => (
          <Chip
            key={`client-${c}`}
            label={c}
            active={client === c}
            onPress={() => setClient(c)}
          />
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  search: {
    backgroundColor: '#F8FAFC',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    color: '#0F172A',
    marginBottom: 8,
  },
  row: { paddingVertical: 6, gap: 8 },
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: '#E2E8F0',
    borderWidth: 1,
    borderColor: '#CBD5E1',
  },
  chipActive: { backgroundColor: '#1D4ED8', borderColor: '#1D4ED8' },
  chipText: { color: '#0F172A', fontWeight: '600' },
  chipTextActive: { color: '#fff' },
});
