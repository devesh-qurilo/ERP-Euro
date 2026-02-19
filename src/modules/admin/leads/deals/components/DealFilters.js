// components/DealFilters.js

import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';

export default function DealFilters({ defaultParams = {}, onApply }) {
  const [pipeline, setPipeline] = useState(defaultParams.pipeline || '');
  const [dateFrom, setDateFrom] = useState(defaultParams.dateFrom || '');
  const [dateTo, setDateTo] = useState(defaultParams.dateTo || '');
  const [query, setQuery] = useState(defaultParams.q || '');

  return (
    <View style={styles.container}>
      <TextInput
        placeholder="Search"
        value={query}
        onChangeText={setQuery}
        style={styles.input}
      />

      <TextInput
        placeholder="Start Date"
        value={dateFrom}
        onChangeText={setDateFrom}
        style={styles.input}
      />

      <TextInput
        placeholder="End Date"
        value={dateTo}
        onChangeText={setDateTo}
        style={styles.input}
      />

      <TextInput
        placeholder="Pipeline"
        value={pipeline}
        onChangeText={setPipeline}
        style={styles.input}
      />

      <TouchableOpacity
        style={styles.applyBtn}
        onPress={() =>
          onApply({
            pipeline,
            dateFrom,
            dateTo,
            q: query,
            page: 0,
          })
        }
      >
        <Text style={{ color: '#fff' }}>Apply</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flexDirection: 'row', padding: 12, gap: 8 },
  input: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#eee',
    padding: 8,
    borderRadius: 8,
    minWidth: 120,
  },
  applyBtn: {
    backgroundColor: '#222',
    padding: 10,
    borderRadius: 8,
  },
});
