import React, { useEffect, useMemo } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigation } from '@react-navigation/native';

import {
  selectBusy,
  selectList,
  selectFilters,
  selectSearch,
  selectView,
} from '../../shared/tasks/store/selectors';

import {
  setSource,
  fetchTasks,
  setModal,
  deleteTask,
  pinTask,
  unpinTask,
} from '../../shared/tasks/store/actions';

export default function TaskTablePreviewCompact() {
  const dispatch = useDispatch();
  const navigation = useNavigation();

  const busy = useSelector(selectBusy);
  const list = useSelector(selectList) || [];
  const filters = useSelector(selectFilters);
  const q = useSelector(selectSearch);
  const view = useSelector(selectView);

  useEffect(() => {
    dispatch(setSource({ kind: 'all' }));
    dispatch(fetchTasks());
  }, [dispatch]);

  const searched = useMemo(() => {
    const term = (q || '').trim().toLowerCase();
    return list.filter(x => {
      if (
        filters.hideCompleted &&
        (x?.taskStage?.name || '').toLowerCase() === 'completed'
      )
        return false;
      if (!term) return true;
      return (x.title || '').toLowerCase().includes(term);
    });
  }, [list, q, filters]);

  const tableData = useMemo(() => searched.slice(0, 4), [searched]); // ONLY 4 rows

  const handleViewAll = () => navigation.navigate('Tasks');

  const formatDate = d => {
    if (!d) return '—';
    try {
      return d.split('T')[0];
    } catch (_) {
      return d;
    }
  };

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.title}>Tasks Overview</Text>
        <TouchableOpacity style={styles.viewAllBtn} onPress={handleViewAll}>
          <Text style={styles.viewAllText}>View All</Text>
        </TouchableOpacity>
      </View>

      {busy ? (
        <View style={{ padding: 20, alignItems: 'center' }}>
          <ActivityIndicator />
        </View>
      ) : (
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View>
            {/* Header Row */}
            <View style={styles.tableHeader}>
              <Text style={[styles.headerCell, { width: 90 }]}>Task ID</Text>
              <Text style={[styles.headerCell, { width: 200 }]}>Name</Text>
              <Text style={[styles.headerCell, { width: 120 }]}>Status</Text>
              <Text style={[styles.headerCell, { width: 140 }]}>Due Date</Text>
            </View>

            {/* Body Rows */}
            {tableData.length === 0 ? (
              <View style={{ padding: 20, alignItems: 'center' }}>
                <Text style={{ color: '#9CA3AF' }}>No tasks found</Text>
              </View>
            ) : (
              tableData.map(item => (
                <View key={item.id} style={styles.row}>
                  <Text style={[styles.cell, { width: 90 }]}>
                    #{String(item.id).padStart(6, '0')}
                  </Text>

                  <Text style={[styles.cell, { width: 200 }]} numberOfLines={1}>
                    {item.title}
                  </Text>

                  <Text style={[styles.cell, { width: 120 }]}>
                    {item.taskStage?.name ?? '—'}
                  </Text>

                  <Text style={[styles.cell, { width: 140 }]}>
                    {formatDate(item.dueDate)}
                  </Text>
                </View>
              ))
            )}
          </View>
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 12,
    marginVertical: 10,
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 8,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  title: { fontSize: 18, fontWeight: '700', color: '#111827' },

  viewAllBtn: {
    backgroundColor: '#06B6D4',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  viewAllText: { color: '#FFF', fontWeight: '700' },

  tableHeader: {
    flexDirection: 'row',
    paddingBottom: 8,
    borderBottomWidth: 2,
    borderColor: '#E5E7EB',
  },
  headerCell: {
    fontSize: 14,
    fontWeight: '700',
    color: '#374151',
  },

  row: {
    flexDirection: 'row',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderColor: '#F3F4F6',
  },
  cell: {
    fontSize: 14,
    color: '#111827',
  },
});
