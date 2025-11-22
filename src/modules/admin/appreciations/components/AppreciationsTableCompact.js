import React, { useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  ActivityIndicator,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';

// adjust these paths to your store files
import { fetchAppreciations } from '../../hr/appreciations/store/actions';
import { selectApprecs } from '../../hr/appreciations/store/selectors';

/**
 * Compact appreciations table for dashboard.
 * - horizontally scrollable
 * - no action buttons
 * - shows columns: Date | Employee | Award | Given By | Summary
 *
 * Props:
 *  - maxRows (number) optional, default 6
 *  - onRowPress (fn) optional, called with row when user taps the row
 */
export default function AppreciationsTableCompact({ maxRows = 6, onRowPress }) {
  const dispatch = useDispatch();
  const list = useSelector(selectApprecs) || [];
  const loading = useSelector(state => state.admin?.appreciations?.loading); // optional, adjust if you have selector

  useEffect(() => {
    // fetch once when mounted (idempotent if already fetched)
    dispatch(fetchAppreciations());
  }, [dispatch]);

  const rows = (Array.isArray(list) ? list : []).slice(0, maxRows);

  return (
    <View style={styles.card}>
      <View style={styles.headerRow}>
        <Text style={styles.title}>Appreciations</Text>
        <Text style={styles.sub}>{list.length} total</Text>
      </View>

      {loading ? (
        <View style={styles.loader}>
          <ActivityIndicator />
        </View>
      ) : rows.length === 0 ? (
        <View style={styles.empty}>
          <Text style={styles.emptyText}>No appreciations yet</Text>
        </View>
      ) : (
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View style={styles.table}>
            {/* Table header */}
            <View style={[styles.tr, styles.thead]}>
              <Text style={[styles.th, { width: 110 }]}>Date</Text>
              <Text style={[styles.th, { width: 220 }]}>Employee</Text>
              <Text style={[styles.th, { width: 200 }]}>Award</Text>
              <Text style={[styles.th, { width: 180 }]}>Given By</Text>
              <Text style={[styles.th, { width: 380 }]}>Summary</Text>
            </View>

            {/* Rows */}
            {rows.map(r => (
              <TouchableOpacity
                activeOpacity={onRowPress ? 0.7 : 1}
                key={r.id ?? `${r.givenToEmployeeName}-${r.date}`}
                onPress={() => onRowPress && onRowPress(r)}
              >
                <View style={styles.tr}>
                  <Text style={[styles.td, { width: 110 }]}>
                    {r.date ? r.date.split('T')[0] : '—'}
                  </Text>
                  <Text style={[styles.td, { width: 220 }]} numberOfLines={1}>
                    {r.givenToEmployeeName || r.givenToEmployee || '—'}
                  </Text>
                  <Text style={[styles.td, { width: 200 }]} numberOfLines={1}>
                    {r.awardTitle || '—'}
                  </Text>
                  <Text style={[styles.td, { width: 180 }]} numberOfLines={1}>
                    {r.givenByName || r.givenBy || '—'}
                  </Text>
                  <Text style={[styles.td, { width: 380 }]} numberOfLines={2}>
                    {r.summary || '—'}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 10,
    marginVertical: 8,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  title: { fontSize: 16, fontWeight: '800', color: '#0f172a' },
  sub: { color: '#6b7280' },

  loader: { paddingVertical: 20, alignItems: 'center' },
  empty: { paddingVertical: 20, alignItems: 'center' },
  emptyText: { color: '#9ca3af' },

  table: { flexDirection: 'column' },

  thead: {
    borderBottomWidth: 1,
    borderBottomColor: '#e6f0f6',
    paddingBottom: 8,
    marginBottom: 8,
  },

  tr: { flexDirection: 'row', alignItems: 'center', paddingVertical: 8 },
  th: { fontWeight: '800', color: '#374151' },
  td: { color: '#111827' },
});
