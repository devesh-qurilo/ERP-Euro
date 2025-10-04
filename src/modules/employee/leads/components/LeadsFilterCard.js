import React, { useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Pressable,
  ScrollView,
} from 'react-native';
import Select from './Select';

export default function LeadsFilterCard({
  // controlled props from screen
  search,
  onSearch,
  status,
  statusOpts,
  onStatus,
  source,
  sourceOpts,
  onSource,
  category,
  categoryOpts,
  onCategory,
  start,
  onStart,
  end,
  onEnd,
  hasFilters,
  onClear,
  onOpenAdd, // open “Add Lead” modal
}) {
  const [showMore, setShowMore] = useState(false);

  const chips = useMemo(() => {
    const c = [];
    if (search.trim()) c.push({ key: 'search', label: `Search: ${search}` });
    if (status !== 'All') c.push({ key: 'status', label: `Status: ${status}` });
    if (source !== 'All') c.push({ key: 'source', label: `Source: ${source}` });
    if (category !== 'All')
      c.push({ key: 'category', label: `Category: ${category}` });
    if (start) c.push({ key: 'start', label: `From: ${start}` });
    if (end) c.push({ key: 'end', label: `To: ${end}` });
    return c;
  }, [search, status, source, category, start, end]);

  const clearOne = key => {
    switch (key) {
      case 'search':
        onSearch('');
        break;
      case 'status':
        onStatus('All');
        break;
      case 'source':
        onSource('All');
        break;
      case 'category':
        onCategory('All');
        break;
      case 'start':
        onStart('');
        break;
      case 'end':
        onEnd('');
        break;
      default:
        break;
    }
  };

  return (
    <View style={styles.card}>
      {/* Row 1: search + add */}
      <View style={styles.row}>
        <TextInput
          value={search}
          onChangeText={onSearch}
          placeholder="Search by name / email / company"
          placeholderTextColor="#9ca3af"
          style={[styles.input, { flexGrow: 1, minWidth: 0 }]}
        />
        <Pressable onPress={onOpenAdd} style={styles.primaryBtn}>
          <Text style={styles.primaryTxt}>+ Add Lead</Text>
        </Pressable>
      </View>

      {/* Row 2: quick selects (wrap nicely) */}
      <View style={styles.wrapRow}>
        <Select
          label="Status"
          value={status}
          options={statusOpts}
          onChange={onStatus}
          style={styles.col}
        />
        <Select
          label="Source"
          value={source}
          options={sourceOpts}
          onChange={onSource}
          style={styles.col}
        />
        <Select
          label="Category"
          value={category}
          options={categoryOpts}
          onChange={onCategory}
          style={styles.col}
        />
      </View>

      {/* Toggle advanced (date range) */}
      <View style={styles.rowBetween}>
        <Pressable onPress={() => setShowMore(v => !v)} style={styles.ghostBtn}>
          <Text style={styles.ghostTxt}>
            {showMore ? 'Hide' : 'More'} Filters ▾
          </Text>
        </Pressable>

        {hasFilters && (
          <Pressable onPress={onClear} style={styles.clearBtn}>
            <Text style={styles.clearTxt}>Clear All</Text>
          </Pressable>
        )}
      </View>

      {/* Advanced: Date range */}
      {showMore && (
        <View style={[styles.wrapRow, { marginTop: 8 }]}>
          <View style={[styles.col, styles.colHalf]}>
            <Text style={styles.label}>Start Date</Text>
            <TextInput
              value={start}
              onChangeText={onStart}
              placeholder="YYYY-MM-DD"
              placeholderTextColor="#9ca3af"
              style={styles.input}
              autoCapitalize="none"
            />
          </View>
          <View style={[styles.col, styles.colHalf]}>
            <Text style={styles.label}>End Date</Text>
            <TextInput
              value={end}
              onChangeText={onEnd}
              placeholder="YYYY-MM-DD"
              placeholderTextColor="#9ca3af"
              style={styles.input}
              autoCapitalize="none"
            />
          </View>
        </View>
      )}

      {/* Active filter chips */}
      {chips.length > 0 && (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingTop: 8 }}
        >
          {chips.map(chip => (
            <Pressable
              key={chip.key}
              onPress={() => clearOne(chip.key)}
              style={styles.chip}
            >
              <Text style={styles.chipTxt}>{chip.label} ✕</Text>
            </Pressable>
          ))}
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },

  row: { flexDirection: 'row', gap: 10, alignItems: 'center' },
  rowBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },

  wrapRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 10,
  },

  col: { flexBasis: '32%', minWidth: 150, marginRight: 8, marginBottom: 10 },
  colHalf: { flexBasis: '48%' },

  label: { fontSize: 12, fontWeight: '800', color: '#374151', marginBottom: 6 },

  input: {
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: '#fff',
    color: '#111827',
  },

  primaryBtn: {
    backgroundColor: '#2c7be5',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  primaryTxt: { color: '#fff', fontWeight: '900' },

  ghostBtn: {
    backgroundColor: '#f3f4f6',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  ghostTxt: { color: '#111827', fontWeight: '800' },

  clearBtn: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  clearTxt: { color: '#111827', fontWeight: '800' },

  chip: {
    backgroundColor: '#eef2ff',
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 6,
    marginRight: 8,
  },
  chipTxt: { color: '#111827', fontWeight: '800' },
});
