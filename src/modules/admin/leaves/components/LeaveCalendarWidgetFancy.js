// src/modules/admin/leaves/components/LeaveCalendarWidgetFancy.js
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  Image,
  Platform,
  Animated,
  Easing,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import DateTimePicker from '@react-native-community/datetimepicker'; // optional
import LinearGradient from 'react-native-linear-gradient'; // optional for nicer card bg
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
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

// map leave types to colors (tweak as needed)
const leaveTypeColor = type => {
  switch ((type || '').toUpperCase()) {
    case 'CASUAL':
      return '#06b6d4'; // cyan
    case 'SICK':
      return '#f97316'; // orange
    case 'EARNED':
      return '#10b981'; // green
    case 'MATERNITY':
      return '#8b5cf6'; // purple
    default:
      return '#6b7280'; // gray
  }
};

// Avatar component: image or initials with accent ring
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
        styles.avatarImg,
        { width: size, height: size, borderRadius: size / 2 },
      ]}
      resizeMode="cover"
    />
  ) : (
    <View
      style={[
        styles.avatarPlaceholder,
        { width: size, height: size, borderRadius: size / 2 },
      ]}
    >
      <Text style={styles.avatarInitials}>{initials || 'NA'}</Text>
    </View>
  );
}

// single employee row with small animation
function EmployeeRow({ item, index, onPress }) {
  const anim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // staggered fade-in
    Animated.timing(anim, {
      toValue: 1,
      duration: 400,
      delay: index * 60,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();
  }, [anim, index]);

  const scale = anim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.98, 1],
  });
  const opacity = anim;

  return (
    <Animated.View
      style={[styles.empCard, { opacity, transform: [{ scale }] }]}
    >
      <TouchableOpacity
        activeOpacity={0.85}
        onPress={() => onPress(item)}
        style={styles.empTouch}
      >
        <Avatar
          name={item.employeeName}
          uri={item.profilePictureUrl}
          size={52}
        />
        <View style={{ flex: 1, marginLeft: 12 }}>
          <Text style={styles.empName} numberOfLines={1}>
            {item.employeeName}
          </Text>
          <Text style={styles.empMeta}>{item.department ?? '—'}</Text>
        </View>

        <View style={styles.rightCol}>
          <View
            style={[
              styles.badge,
              {
                backgroundColor: leaveTypeColor(item.leaveType) + '22',
                borderColor: leaveTypeColor(item.leaveType),
              },
            ]}
          >
            <Text
              style={[
                styles.badgeText,
                { color: leaveTypeColor(item.leaveType) },
              ]}
            >
              {(item.leaveType || '').toUpperCase()}
            </Text>
          </View>
          <Text style={styles.smallMuted}>{item.employeeId}</Text>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
}

// skeleton row while loading
function SkeletonRow() {
  const anim = useRef(new Animated.Value(0.2)).current;
  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(anim, {
          toValue: 0.6,
          duration: 700,
          useNativeDriver: false,
        }),
        Animated.timing(anim, {
          toValue: 0.2,
          duration: 700,
          useNativeDriver: false,
        }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [anim]);

  return (
    <Animated.View style={[styles.empCard, { opacity: anim }]}>
      <View style={styles.empTouch}>
        <View style={[styles.skelCircle]} />
        <View style={{ marginLeft: 12, flex: 1 }}>
          <View style={styles.skelLineShort} />
          <View style={{ height: 8 }} />
          <View style={styles.skelLineLong} />
        </View>
        <View style={{ width: 60, alignItems: 'flex-end' }}>
          <View style={styles.skelBadge} />
          <View style={{ height: 6 }} />
          <View
            style={{
              width: 40,
              height: 10,
              backgroundColor: '#eee',
              borderRadius: 6,
            }}
          />
        </View>
      </View>
    </Animated.View>
  );
}

export default function LeaveCalendarWidgetFancy({ initialDate }) {
  const dispatch = useDispatch();
  const navigation = useNavigation();

  const loading = useSelector(selectLeavesLoading);
  const error = useSelector(selectLeavesError);
  const entries = useSelector(selectLeavesEntries);

  const [selectedDate, setSelectedDate] = useState(
    initialDate ?? toISODate(new Date()),
  );
  const [showPicker, setShowPicker] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  // animated header accent
  const headerAnim = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.timing(headerAnim, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    }).start();
  }, []);

  const load = useCallback(
    date => dispatch(fetchLeavesCalendarRequest(date)),
    [dispatch],
  );

  useEffect(() => {
    load(selectedDate);
  }, [load, selectedDate]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    load(selectedDate);
    setTimeout(() => setRefreshing(false), 800);
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
    if (!dt && event?.type === 'set' && event.nativeEvent?.timestamp)
      dt = new Date(event.nativeEvent.timestamp);
    if (dt) setSelectedDate(toISODate(dt));
  };

  const rowsForDate = useMemo(
    () =>
      entries.find(e => e.date === selectedDate) || {
        date: selectedDate,
        employeesOnLeave: [],
      },
    [entries, selectedDate],
  );
  const list = rowsForDate.employeesOnLeave || [];

  const onPressEmployee = emp =>
    navigation.navigate('EmployeeDetail', { employeeId: emp.employeeId });

  const headerScale = headerAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.98, 1],
  });

  return (
    <View style={styles.container}>
      <Animated.View
        style={[styles.header, { transform: [{ scale: headerScale }] }]}
      >
        <View style={styles.headerLeft}>
          <Text style={styles.headerTitle}>Leaves</Text>
          <Text style={styles.headerSub}>Date-wise team leaves</Text>
        </View>

        <View style={styles.headerRight}>
          <TouchableOpacity style={styles.dateNav} onPress={onPrev}>
            <Icon name="chevron-left" size={20} color="#374151" />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.dateChip}
            onPress={() => setShowPicker(true)}
          >
            <Icon name="calendar" size={16} color="#075985" />
            <Text style={styles.dateChipText}>{selectedDate}</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.dateNav} onPress={onNext}>
            <Icon name="chevron-right" size={20} color="#374151" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.todayBtn} onPress={onToday}>
            <Text style={styles.todayText}>Today</Text>
          </TouchableOpacity>
        </View>
      </Animated.View>

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

      <LinearGradient colors={['#ffffff', '#f8fafc']} style={styles.card}>
        <View style={styles.cardHeaderRow}>
          <View>
            <Text style={styles.cardTitle}>Employees on leave</Text>
            <Text style={styles.cardSubtitle}>
              {list.length} on leave • {selectedDate}
            </Text>
          </View>

          <TouchableOpacity
            onPress={() => navigation.navigate('Leaves')}
            style={styles.viewAllBtn}
          >
            <Text style={styles.viewAllText}>View all</Text>
          </TouchableOpacity>
        </View>

        <View style={{ marginTop: 8 }}>
          {loading ? (
            // show 3 skeleton rows
            <>
              <SkeletonRow />
              <SkeletonRow />
              <SkeletonRow />
            </>
          ) : error ? (
            <View style={styles.emptyWrap}>
              <Text style={styles.errorText}>Something went wrong</Text>
              <Text style={styles.errorMsg}>{error}</Text>
              <TouchableOpacity
                onPress={() => load(selectedDate)}
                style={styles.retryBtn}
              >
                <Text style={styles.retryText}>Retry</Text>
              </TouchableOpacity>
            </View>
          ) : list.length === 0 ? (
            <View style={styles.emptyWrap}>
              <Text style={styles.emptyTitle}>No leaves on this date 🎉</Text>
              <Text style={styles.emptyText}>
                Looks like everyone is present. Try other dates.
              </Text>
            </View>
          ) : (
            <FlatList
              data={list}
              keyExtractor={i => i.employeeId || i.employeeName + Math.random()}
              renderItem={({ item, index }) => (
                <EmployeeRow
                  item={item}
                  index={index}
                  onPress={onPressEmployee}
                />
              )}
              ItemSeparatorComponent={() => <View style={{ height: 8 }} />}
              refreshControl={<ActivityIndicator animating={refreshing} />}
            />
          )}
        </View>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginTop: 12 },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  headerLeft: {},
  headerTitle: { fontSize: 18, fontWeight: '800', color: '#0f172a' },
  headerSub: { color: '#6b7280', marginTop: 2 },

  headerRight: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  dateNav: {
    backgroundColor: '#fff',
    padding: 8,
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
    paddingHorizontal: 10,
    paddingVertical: 8,
    backgroundColor: '#0369a1',
    borderRadius: 10,
    marginLeft: 6,
  },
  todayText: { color: '#fff', fontWeight: '800' },

  card: {
    borderRadius: 14,
    padding: 12,
    minHeight: 140,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 12,
    elevation: 4,
  },

  cardHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardTitle: { fontSize: 16, fontWeight: '800', color: '#0f172a' },
  cardSubtitle: { color: '#6b7280', marginTop: 4 },

  viewAllBtn: {
    backgroundColor: '#e0f2fe',
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 10,
  },
  viewAllText: { color: '#0369a1', fontWeight: '800' },

  empCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 10,
    // subtle border
    borderWidth: 1,
    borderColor: '#f3f4f6',
    shadowColor: '#000',
    shadowOpacity: 0.03,
    shadowRadius: 6,
    elevation: 2,
  },
  empTouch: { flexDirection: 'row', alignItems: 'center' },

  avatarImg: {
    width: 52,
    height: 52,
    borderRadius: 26,
    borderWidth: 2,
    borderColor: '#fff',
    backgroundColor: '#eee',
  },
  avatarPlaceholder: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: '#c7d2fe',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarInitials: { color: '#3730a3', fontWeight: '800' },

  empName: { fontWeight: '800', color: '#0f172a', fontSize: 15 },
  empMeta: { color: '#6b7280', marginTop: 4 },

  rightCol: { alignItems: 'flex-end' },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: 999,
    borderWidth: 1,
    marginBottom: 6,
  },
  badgeText: { fontWeight: '800', fontSize: 11 },

  smallMuted: { color: '#9ca3af', marginTop: 4 },

  emptyWrap: { paddingVertical: 20, alignItems: 'center' },
  emptyTitle: { fontSize: 16, fontWeight: '800', color: '#065f46' },
  emptyText: { color: '#6b7280', marginTop: 6 },

  errorText: { color: '#b91c1c', fontWeight: '800' },
  errorMsg: { color: '#7f1d1d', marginTop: 6 },

  retryBtn: {
    marginTop: 10,
    backgroundColor: '#fee2e2',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
  },
  retryText: { color: '#7f1d1d', fontWeight: '800' },

  // skeletons
  skelCircle: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: '#f3f4f6',
  },
  skelLineShort: {
    width: 120,
    height: 12,
    backgroundColor: '#f3f4f6',
    borderRadius: 8,
  },
  skelLineLong: {
    width: 180,
    height: 10,
    backgroundColor: '#f3f4f6',
    borderRadius: 8,
  },
  skelBadge: {
    width: 60,
    height: 18,
    borderRadius: 10,
    backgroundColor: '#f3f4f6',
  },
});
