// components/InvoiceFilters.js
import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  TextInput,
  StyleSheet,
  Keyboard,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';

const DEFAULT_STATUSES = ['All', 'Paid', 'Unpaid', 'Credit'];

export default function InvoiceFilters({
  onChange,
  projects = [],
  statuses = DEFAULT_STATUSES,
  initialFilters = {},
  debounceMs = 250,
}) {
  const [fromDate, setFromDate] = useState(initialFilters.fromDate || '');
  const [toDate, setToDate] = useState(initialFilters.toDate || '');
  const [status, setStatus] = useState(initialFilters.status || statuses[0]);
  const [project, setProject] = useState(initialFilters.project || '');

  const [showFromPicker, setShowFromPicker] = useState(false);
  const [showToPicker, setShowToPicker] = useState(false);

  const lastSentRef = useRef({
    fromDate: initialFilters.fromDate || '',
    toDate: initialFilters.toDate || '',
    status: initialFilters.status || statuses[0] || '',
    project: initialFilters.project || '',
  });
  const debounceRef = useRef(null);

  // build next filter object
  const next = {
    fromDate: fromDate || '',
    toDate: toDate || '',
    status: status || '',
    project: project || '',
  };

  // debounce auto-apply
  useEffect(() => {
    if (typeof onChange !== 'function') return;

    const same =
      lastSentRef.current.fromDate === next.fromDate &&
      lastSentRef.current.toDate === next.toDate &&
      lastSentRef.current.status === next.status &&
      lastSentRef.current.project === next.project;

    if (same) return;

    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      try {
        onChange(next);
        lastSentRef.current = next;
      } catch (e) {
        // ignore
        // eslint-disable-next-line no-console
        console.warn('InvoiceFilters auto-apply error', e);
      }
    }, debounceMs);

    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
        debounceRef.current = null;
      }
    };
    // intentionally not including onChange in deps to avoid parent ref loops
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fromDate, toDate, status, project, debounceMs]);

  const isoDate = d => {
    if (!d) return '';
    if (typeof d === 'string') return d;
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  };

  const onChangeDate = (field, _e, selected) => {
    if (!selected) {
      setShowFromPicker(false);
      setShowToPicker(false);
      return;
    }
    const iso = isoDate(selected);
    if (field === 'from') {
      setFromDate(iso);
      setShowFromPicker(false);
    } else {
      setToDate(iso);
      setShowToPicker(false);
    }
  };

  const clear = () => {
    setFromDate('');
    setToDate('');
    setStatus(statuses[0] || 'All');
    setProject('');
    Keyboard.dismiss();
    // also emit cleared filters immediately
    const cleared = {
      fromDate: '',
      toDate: '',
      status: statuses[0] || 'All',
      project: '',
    };
    if (typeof onChange === 'function') {
      onChange(cleared);
      lastSentRef.current = cleared;
    }
  };

  return (
    <View style={{ marginBottom: 10 }}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.row}
      >
        <View style={styles.box}>
          {/* <Text style={styles.label}>From</Text> */}
          <TouchableOpacity
            onPress={() => setShowFromPicker(true)}
            style={styles.touch}
          >
            <Text style={styles.label}>From</Text>
            <Text style={styles.value}>{fromDate || 'Any'}</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.box}>
          {/* <Text style={styles.label}>To</Text> */}
          <TouchableOpacity
            onPress={() => setShowToPicker(true)}
            style={styles.touch}
          >
            <Text style={styles.label}>To</Text>
            <Text style={styles.value}>{toDate || 'Any'}</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.box}>
          {/* <Text style={styles.label}>Status</Text> */}
          <TouchableOpacity
            onPress={() => {
              const nextStatus =
                statuses[(statuses.indexOf(status) + 1) % statuses.length];
              setStatus(nextStatus);
            }}
            style={styles.touch}
          >
            <Text style={styles.label}>Status</Text>
            <Text style={styles.value}>{status}</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.box}>
          {/* <Text style={styles.label}>Project</Text> */}
          <TextInput
            placeholder="Search Project.."
            value={project}
            onChangeText={setProject}
            style={{ paddingVertical: 4, minWidth: 140, minHeight: 33 }}
          />
        </View>

        <TouchableOpacity onPress={clear} style={[styles.box, styles.clearBox]}>
          <Text style={{ color: '#ef4444', fontWeight: '700' }}>Clear</Text>
        </TouchableOpacity>
      </ScrollView>

      {showFromPicker && (
        <DateTimePicker
          value={fromDate ? new Date(fromDate) : new Date()}
          mode="date"
          onChange={(e, d) => onChangeDate('from', e, d)}
        />
      )}
      {showToPicker && (
        <DateTimePicker
          value={toDate ? new Date(toDate) : new Date()}
          mode="date"
          onChange={(e, d) => onChangeDate('to', e, d)}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { paddingVertical: 6, alignItems: 'center' },
  box: {
    flexDirection: 'row',
    paddingHorizontal: 12,
    // paddingVertical: 8,
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 10,
    marginRight: 10,
    backgroundColor: '#fff',
    minWidth: 120,
    justifyContent: 'center',
  },
  label: {
    fontSize: 11,
    color: '#6b7280',
    marginBottom: 4,
    paddingRight: 5,
    fontWeight: '600',
  },
  touch: { flexDirection: 'row', paddingVertical: 8 },
  value: { fontSize: 11, fontWeight: '600' },
  clearBox: { justifyContent: 'center', alignItems: 'center', minHeight: 35 },
});
