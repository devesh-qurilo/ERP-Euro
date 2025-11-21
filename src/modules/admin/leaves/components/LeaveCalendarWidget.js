// src/modules/admin/leaves/components/LeaveCalendarWidget.js
import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  RefreshControl,
  Image,
  Platform,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import DateTimePicker from '@react-native-community/datetimepicker'; // optional
import LinearGradient from 'react-native-linear-gradient'; // optional
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'; // optional
import { fetchLeavesCalendarRequest } from '../store/actions';
import {
  selectLeavesLoading,
  selectLeavesError,
  selectLeavesEntries,
} from '../store/selectors';
import { useNavigation } from '@react-navigation/native';

// helper: Date -> YYYY-MM-DD
const toISODate = d => {
  const dt = d instanceof Date ? d : new Date(d);
  const yyyy = dt.getFullYear();
  const mm = `0${dt.getMonth() + 1}`.slice(-2);
  const dd = `0${dt.getDate()}`.slice(-2);
  return `${yyyy}-${mm}-${dd}`;
};

// small avatar: if no image, show initials
function Avatar({ name, uri, size = 44 }) {
  const initials = (name || '')
    .split(' ')
    .map(s => s[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();
  return uri ? (
    <Image
      source={{ uri }}
      style={[
        styles.avatar,
        { width: size, height: size, borderRadius: size / 2 },
      ]}
    />
  ) : (
    <View
      style={[
        styles.avatarPlaceholder,
        { width: size, height: size, borderRadius: size / 2 },
      ]}
    >
      <Text style={styles.avatarInitials}>{initials}</Text>
    </View>
  );
}

function EmployeeChip({ emp }) {
  return (
    <View style={styles.empRow}>
      <Avatar name={emp.employeeName} uri={emp.profilePictureUrl} />
      <View style={{ marginLeft: 10, flex: 1 }}>
        <Text style={styles.empName}>{emp.employeeName}</Text>
        <Text style={styles.empMeta}>
          {emp.department ?? '—'} • {emp.leaveType}
        </Text>
      </View>
      <View style={styles.tagWrap}>
        <Text style={styles.tagText}>{emp.leaveType}</Text>
      </View>
    </View>
  );
}

export default function LeaveCalendarWidget({ initialDate }) {
  const dispatch = useDispatch();
  const navigation = useNavigation();

  const loading = useSelector(selectLeavesLoading);
  const error = useSelector(selectLeavesError);
  const entries = useSelector(selectLeavesEntries);

  // selected date local UI
  const [selectedDate, setSelectedDate] = useState(
    initialDate ?? toISODate(new Date()),
  );
  const [showPicker, setShowPicker] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(
    date => {
      dispatch(fetchLeavesCalendarRequest(date));
    },
    [dispatch],
  );

  useEffect(() => {
    load(selectedDate);
  }, [load, selectedDate]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    load(selectedDate);
    setTimeout(() => setRefreshing(false), 700);
  }, [load, selectedDate]);

  const onPrev = () => {
    const d = new Date(selectedDate);
    d.setDate(d.getDate() - 1);
    setSelectedDate(toISODate(d));
  };
  const onNext = () => {
    const d = new Date(selectedDate);
    d.setDate(d.getDate() + 1);
    setSelectedDate(toISODate(d));
  };
  const onToday = () => setSelectedDate(toISODate(new Date()));

  const onPick = (event, dt) => {
    setShowPicker(Platform.OS === 'ios');
    if (!dt && event?.type === 'set' && event.nativeEvent?.timestamp) {
      dt = new Date(event.nativeEvent.timestamp);
    }
    if (dt) setSelectedDate(toISODate(dt));
  };

  const rowsForDate = entries.find(e => e.date === selectedDate) || {
    date: selectedDate,
    employeesOnLeave: [],
  };

  const handleViewAll = () => navigation.navigate('Leaves'); // adjust route name if different

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.headerTitle}>Leaves Calendar</Text>
        <TouchableOpacity onPress={handleViewAll}>
          <Text style={styles.viewAll}>View all ▸</Text>
        </TouchableOpacity>
      </View>

      <LinearGradient colors={['#eef2ff', '#fff']} style={styles.card}>
        <View style={styles.dateRow}>
          <TouchableOpacity style={styles.smallBtn} onPress={onPrev}>
            <Icon name="chevron-left" size={20} color="#374151" />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.dateBtn}
            onPress={() => setShowPicker(true)}
          >
            <Text style={styles.dateText}>{selectedDate}</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.smallBtn} onPress={onNext}>
            <Icon name="chevron-right" size={20} color="#374151" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.todayBtn} onPress={onToday}>
            <Text style={styles.todayText}>Today</Text>
          </TouchableOpacity>
        </View>

        {showPicker && (
          <DateTimePicker
            value={new Date(selectedDate)}
            mode="date"
            display="default"
            onChange={onPick}
            maximumDate={new Date(2100, 0, 1)}
            minimumDate={new Date(2000, 0, 1)}
          />
        )}

        <View style={{ marginTop: 12 }}>
          {loading ? (
            <ActivityIndicator />
          ) : error ? (
            <View style={styles.msg}>
              <Text style={{ color: '#ef4444' }}>{error}</Text>
            </View>
          ) : rowsForDate.employeesOnLeave.length === 0 ? (
            <View style={styles.msg}>
              <Text style={{ color: '#6b7280' }}>No leaves on this date</Text>
            </View>
          ) : (
            <FlatList
              data={rowsForDate.employeesOnLeave}
              keyExtractor={i => i.employeeId || i.employeeName}
              renderItem={({ item }) => (
                <TouchableOpacity
                  activeOpacity={0.85}
                  onPress={() =>
                    navigation.navigate('EmployeeDetail', {
                      employeeId: item.employeeId,
                    })
                  }
                >
                  <EmployeeChip emp={item} />
                </TouchableOpacity>
              )}
              ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
              refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
              }
            />
          )}
        </View>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginTop: 12 },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  headerTitle: { fontSize: 18, fontWeight: '800', color: '#0f172a' },
  viewAll: { color: '#06b6d4', fontWeight: '700' },

  card: {
    borderRadius: 12,
    padding: 12,
    minHeight: 120,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 3,
  },

  dateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  smallBtn: {
    padding: 8,
    backgroundColor: '#fff',
    borderRadius: 8,
    elevation: 1,
  },
  dateBtn: {
    flex: 1,
    marginHorizontal: 8,
    paddingVertical: 8,
    backgroundColor: '#fff',
    borderRadius: 8,
    alignItems: 'center',
  },
  dateText: { fontWeight: '800', color: '#0f172a' },
  todayBtn: {
    paddingHorizontal: 10,
    paddingVertical: 8,
    backgroundColor: '#06b6d4',
    borderRadius: 8,
  },
  todayText: { color: '#022027', fontWeight: '700' },

  msg: { paddingVertical: 18, alignItems: 'center' },

  empRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#fff',
    borderRadius: 10,
  },
  avatar: { width: 44, height: 44, borderRadius: 22 },
  avatarPlaceholder: {
    backgroundColor: '#6366f1',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarInitials: { color: '#fff', fontWeight: '800' },
  empName: { fontWeight: '800', color: '#0f172a' },
  empMeta: { color: '#6b7280', marginTop: 4 },

  tagWrap: {
    backgroundColor: '#fee2e2',
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: 8,
  },
  tagText: { color: '#7f1d1d', fontWeight: '800' },
});
