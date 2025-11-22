// // WorkFromHomeCardLayout.js
import React, { useEffect, useCallback, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Image,
  ActivityIndicator,
  Platform,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import DateTimePicker from '@react-native-community/datetimepicker'; // optional
import LinearGradient from 'react-native-linear-gradient'; // optional
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'; // optional
import { fetchWfhRequest } from '../store/actions';
import {
  selectWfhEntries,
  selectWfhLoading,
  selectWfhError,
} from '../store/selectors';
import { useNavigation } from '@react-navigation/native';

// helper
const toISODate = d => {
  const dt = d instanceof Date ? d : new Date(d);
  const yyyy = dt.getFullYear();
  const mm = `0${dt.getMonth() + 1}`.slice(-2);
  const dd = `0${dt.getDate()}`.slice(-2);
  return `${yyyy}-${mm}-${dd}`;
};

// avatar with initials fallback
function Avatar({ uri, name, size = 56 }) {
  const initials =
    (name || '')
      .split(' ')
      .map(s => s[0])
      .slice(0, 2)
      .join('')
      .toUpperCase() || 'NA';

  return uri ? (
    <Image
      source={{ uri }}
      style={{ width: size, height: size, borderRadius: size / 2 }}
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

// status pill
const StatusPill = ({ isPresent, status }) => {
  const bg = isPresent ? '#dcfce7' : '#fee2e2';
  const color = isPresent ? '#065f46' : '#991b1b';
  return (
    <View
      style={[styles.statusPill, { backgroundColor: bg, borderColor: color }]}
    >
      <Text style={[styles.statusPillText, { color }]}>
        {status ?? (isPresent ? 'PRESENT' : 'ABSENT')}
      </Text>
    </View>
  );
};

// tiny flag (round) - we use first two letters of department or country as pseudo-flag
const TinyFlag = ({ text }) => {
  const bg = '#e0f2fe';
  return (
    <View style={[styles.flagWrap, { backgroundColor: bg }]}>
      <Text style={styles.flagText}>
        {(text || '').slice(0, 10).toUpperCase() || '—'}
      </Text>
    </View>
  );
};

// single card component
function WfhCard({ item, onPress }) {
  const {
    employeeName,
    profilePictureUrl,
    designationName,
    departmentName,
    clockInTime,
    clockOutTime,
    clockInWorkingFrom,
    clockOutWorkingFrom,
    late,
    halfDay,
    attendanceId,
    markedByName,
    isPresent,
    status,
  } = item;

  // compute duration if possible (simple hours diff)
  let durationText = '—';
  try {
    if (clockInTime && clockOutTime) {
      const [ih, im] = clockInTime.split(':').map(Number);
      const [oh, om] = clockOutTime.split(':').map(Number);
      let mins = oh * 60 + om - (ih * 60 + im);
      if (mins < 0) mins += 24 * 60;
      const h = Math.floor(mins / 60);
      const m = mins % 60;
      durationText = `${h}h ${m}m`;
    }
  } catch (e) {
    /* ignore */
  }

  return (
    <TouchableOpacity
      activeOpacity={0.9}
      onPress={() => onPress(item)}
      style={styles.cardTouchable}
    >
      <LinearGradient colors={['#ffffff', '#f8fafc']} style={styles.card}>
        {/* ROW 1 */}
        <View style={styles.row}>
          <View style={styles.colLeft}>
            <Avatar uri={profilePictureUrl} name={employeeName} />
          </View>

          <View style={styles.colMiddle}>
            <Text style={styles.empName} numberOfLines={1}>
              {employeeName}
            </Text>
            <Text style={styles.empDesignation} numberOfLines={1}>
              {designationName ?? departmentName ?? '—'}
            </Text>
          </View>

          {/* <View style={styles.colRight}>
            <StatusPill isPresent={isPresent} status={status} />
            <View style={{ height: 8 }} />
            <TinyFlag text={departmentName || designationName || ''} />
          </View> */}
        </View>

        {/* ROW 2 */}
        <View style={[styles.row2, styles.rowSpacing2]}>
          <View style={styles.colSmall}>
            <Text style={styles.smallLabel}>Clock In</Text>
            <Text style={styles.smallValue}>{clockInTime ?? '—'}</Text>
            <Text style={styles.smallMeta}>{clockInWorkingFrom ?? ''}</Text>
          </View>

          <View style={styles.colSmall}>
            <Text style={styles.smallLabel}>Clock Out</Text>
            <Text style={styles.smallValue}>{clockOutTime ?? '—'}</Text>
            <Text style={styles.smallMeta}>{clockOutWorkingFrom ?? ''}</Text>
          </View>

          <View style={styles.colSmall}>
            <Text style={styles.smallLabel}>Duration</Text>
            <Text style={styles.smallValue}>{durationText}</Text>
            <Text style={styles.smallMeta}> </Text>
          </View>
        </View>

        {/* ROW 3 */}
        <View style={[styles.row3, styles.rowSpacing]}>
          <View style={styles.colSmall}>
            <Text style={styles.smallLabel}>Presence</Text>
            <Text
              style={[
                styles.presenceText,
                { color: isPresent ? '#065f46' : '#991b1b' },
              ]}
            >
              {isPresent ? 'Present' : 'Absent'}
            </Text>
          </View>

          <View style={styles.colSmall}>
            <Text style={styles.smallLabel}>Flags</Text>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              {late ? (
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>Late</Text>
                </View>
              ) : null}
              {halfDay ? (
                <View style={[styles.badge, { backgroundColor: '#fff7ed' }]}>
                  <Text style={[styles.badgeText, { color: '#92400e' }]}>
                    Half
                  </Text>
                </View>
              ) : null}
              {!late && !halfDay ? (
                <Text style={styles.smallMeta}>—</Text>
              ) : null}
            </View>
          </View>

          <View style={styles.colSmall}>
            <Text style={styles.smallLabel}>Marked by</Text>
            <Text style={styles.smallMeta}>{markedByName ?? '—'}</Text>
          </View>

          <View style={styles.colRight}>
            <StatusPill isPresent={isPresent} status={status} />
            {/* <View style={{ height: 4 }} /> */}
            <TinyFlag text={departmentName || designationName || ''} />
          </View>
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );
}

export default function WorkFromHomeWidgetFancy({ initialDate }) {
  const dispatch = useDispatch();
  const navigation = useNavigation();

  const loading = useSelector(selectWfhLoading);
  const error = useSelector(selectWfhError);
  const entries = useSelector(selectWfhEntries) || [];

  const [selectedDate, setSelectedDate] = useState(
    initialDate ?? toISODate(new Date()),
  );
  const [showPicker, setShowPicker] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(d => dispatch(fetchWfhRequest(d)), [dispatch]);

  useEffect(() => {
    load(selectedDate);
  }, [load, selectedDate]);

  const onRefresh = () => {
    setRefreshing(true);
    load(selectedDate);
    setTimeout(() => setRefreshing(false), 700);
  };

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
    if (!dt && event?.type === 'set' && event.nativeEvent?.timestamp)
      dt = new Date(event.nativeEvent.timestamp);
    if (dt) setSelectedDate(toISODate(dt));
  };

  const onPressRow = rec =>
    navigation.navigate('EmployeeDetail', { employeeId: rec.employeeId });

  return (
    <View style={{ marginTop: 12 }}>
      {/* Header controls */}
      <View style={styles.headerRow}>
        <Text style={styles.headerTitle}>Work From Home</Text>
        <TouchableOpacity onPress={() => navigation.navigate('Attendance')}>
          <Text style={styles.viewAll}>View all ▸</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.controls}>
        <TouchableOpacity style={styles.ctrlBtn} onPress={onPrev}>
          <Icon name="chevron-left" size={20} color="#374151" />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.dateChip}
          onPress={() => setShowPicker(true)}
        >
          <Icon name="calendar" size={14} color="#075985" />
          <Text style={styles.dateChipText}>{selectedDate}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.ctrlBtn} onPress={onNext}>
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

      {/* Content */}
      {loading ? (
        <View style={{ paddingVertical: 20 }}>
          <ActivityIndicator />
        </View>
      ) : error ? (
        <View style={{ paddingVertical: 16, alignItems: 'center' }}>
          <Text style={{ color: '#ef4444' }}>{error}</Text>
        </View>
      ) : entries.length === 0 ? (
        <View style={{ paddingVertical: 18, alignItems: 'center' }}>
          <Text style={{ color: '#6b7280' }}>
            No WFH records for {selectedDate}
          </Text>
        </View>
      ) : (
        <FlatList
          data={entries}
          keyExtractor={i => String(i.attendanceId || i.employeeId)}
          renderItem={({ item }) => (
            <WfhCard item={item} onPress={onPressRow} />
          )}
          ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
          contentContainerStyle={{ paddingVertical: 8 }}
          refreshing={refreshing}
          onRefresh={onRefresh}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: { fontSize: 18, fontWeight: '800', color: '#0f172a' },
  viewAll: { color: '#06b6d4', fontWeight: '700' },

  controls: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    gap: 8,
  },
  ctrlBtn: {
    padding: 8,
    backgroundColor: '#cdd3d6ff',
    borderRadius: 10,
    elevation: 1,
  },
  dateChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 8,
    backgroundColor: '#ecfeff',
    borderRadius: 12,
    marginHorizontal: 6,
  },
  dateChipText: { marginLeft: 8, color: '#075985', fontWeight: '700' },
  todayBtn: {
    marginLeft: 8,
    backgroundColor: '#0369a1',
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 10,
  },
  todayText: { color: '#fff', fontWeight: '800' },

  cardTouchable: { paddingHorizontal: 0 },
  card: {
    borderRadius: 14,
    padding: 12,
    marginHorizontal: 0,
    shadowColor: '#000',
    shadowOpacity: 0.03,
    shadowRadius: 8,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#f3f4f6',
    backgroundColor: '#e2e7f0ff',
  },

  row: {
    width: '90%',
    flexDirection: 'row',
    alignItems: 'center',
    // borderWidth: 1,
    justifyContent: 'center',
  },
  row2: {
    width: '90%',
    flexDirection: 'row',
    alignItems: 'center',
    // borderWidth: 1,
    justifyContent: 'space-between',
  },
  row3: {
    width: '90%',
    flexDirection: 'row',
    alignItems: 'center',
    // borderWidth: 1,
    paddingBottom: 30,
    justifyContent: 'space-between',
  },
  rowSpacing: { marginTop: 12 },
  rowSpacing2: { marginTop: 12 },

  colLeft: { width: 72, alignItems: 'center', justifyContent: 'center' },
  colMiddle: { flex: 1, paddingHorizontal: 8 },
  colRight: { width: 86, alignItems: 'flex-end', justifyContent: 'flex-start' },

  empName: { fontSize: 15, fontWeight: '800', color: '#0f172a' },
  empDesignation: { fontSize: 12, color: '#6b7280', marginTop: 4 },

  smallLabel: { fontSize: 11, color: '#9ca3af' },
  smallValue: {
    fontSize: 13,
    fontWeight: '800',
    color: '#0f172a',
    marginTop: 4,
  },
  smallMeta: { fontSize: 12, color: '#6b7280', marginTop: 4 },

  presenceText: { fontWeight: '800', fontSize: 14 },

  statusPill: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    // borderWidth: 1,
  },
  statusPillText: { fontWeight: '400' },

  flagWrap: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 },
  flagText: { fontWeight: '400', color: '#075985' },

  badge: {
    backgroundColor: '#fee2e2',
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: 8,
    marginRight: 6,
  },
  badgeText: { color: '#b91c1c', fontWeight: '800' },

  avatarPlaceholder: {
    backgroundColor: '#e6eef8',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarInitials: { color: '#075985', fontWeight: '800', fontSize: 16 },
});
