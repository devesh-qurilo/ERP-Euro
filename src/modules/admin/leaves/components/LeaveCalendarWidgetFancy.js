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
  Dimensions,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import DateTimePicker from '@react-native-community/datetimepicker';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { fetchLeavesCalendarRequest } from '../store/actions';
import {
  selectLeavesLoading,
  selectLeavesError,
  selectLeavesEntries,
} from '../store/selectors';
import { useNavigation } from '@react-navigation/native';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

// helper: Date -> YYYY-MM-DD
const toISODate = d => {
  const dt = d instanceof Date ? d : new Date(d);
  const yyyy = dt.getFullYear();
  const mm = `0${dt.getMonth() + 1}`.slice(-2);
  const dd = `0${dt.getDate()}`.slice(-2);
  return `${yyyy}-${mm}-${dd}`;
};

// Format date for display (e.g., "Mon, Jan 15")
const formatDisplayDate = dateStr => {
  const d = new Date(dateStr);
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const months = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ];
  return `${days[d.getDay()]}, ${months[d.getMonth()]} ${d.getDate()}`;
};

// map leave types to colors
const leaveTypeColor = type => {
  switch ((type || '').toUpperCase()) {
    case 'CASUAL':
      return '#06b6d4';
    case 'SICK':
      return '#f97316';
    case 'EARNED':
      return '#10b981';
    case 'MATERNITY':
      return '#8b5cf6';
    default:
      return '#6b7280';
  }
};

// Avatar component
function Avatar({ name, uri, size = 40 }) {
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
      <Text style={[styles.avatarInitials, { fontSize: size * 0.35 }]}>
        {initials || 'NA'}
      </Text>
    </View>
  );
}

// Employee row with animation
function EmployeeRow({ item, index, onPress }) {
  const anim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(anim, {
      toValue: 1,
      duration: 350,
      delay: index * 50,
      easing: Easing.out(Easing.ease),
      useNativeDriver: true,
    }).start();
  }, [anim, index]);

  const opacity = anim;
  const translateY = anim.interpolate({
    inputRange: [0, 1],
    outputRange: [10, 0],
  });

  return (
    <Animated.View
      style={[styles.empCard, { opacity, transform: [{ translateY }] }]}
    >
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={() => onPress(item)}
        style={styles.empTouch}
      >
        <Avatar
          name={item.employeeName}
          uri={item.profilePictureUrl}
          size={40}
        />
        <View style={styles.empInfo}>
          <Text style={styles.empName} numberOfLines={1}>
            {item.employeeName}
          </Text>
          <View style={styles.empMetaRow}>
            {item.department && (
              <>
                <Icon name="briefcase-outline" size={12} color="#9ca3af" />
                <Text style={styles.empDept} numberOfLines={1}>
                  {item.department}
                </Text>
              </>
            )}
          </View>
        </View>

        <View
          style={[
            styles.badge,
            {
              backgroundColor: leaveTypeColor(item.leaveType) + '15',
              borderColor: leaveTypeColor(item.leaveType) + '30',
            },
          ]}
        >
          <Text
            style={[
              styles.badgeText,
              { color: leaveTypeColor(item.leaveType) },
            ]}
          >
            {(item.leaveType || 'Leave').toUpperCase()}
          </Text>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
}

// Skeleton row
function SkeletonRow() {
  const anim = useRef(new Animated.Value(0.3)).current;
  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(anim, {
          toValue: 0.7,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(anim, {
          toValue: 0.3,
          duration: 800,
          useNativeDriver: true,
        }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [anim]);

  return (
    <Animated.View style={[styles.empCard, { opacity: anim }]}>
      <View style={styles.empTouch}>
        <View style={styles.skelCircle} />
        <View style={styles.empInfo}>
          <View style={styles.skelLineShort} />
          <View style={{ height: 6 }} />
          <View style={styles.skelLineTiny} />
        </View>
        <View style={styles.skelBadge} />
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

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Team Leaves</Text>
      </View>

      {/* Date Selector Card */}
      <View style={styles.dateCard}>
        <View style={styles.dateHeader}>
          <View style={styles.dateInfo}>
            <Text style={styles.dateDisplay}>
              {formatDisplayDate(selectedDate)}
            </Text>
            <Text style={styles.dateCount}>
              {list.length} {list.length === 1 ? 'person' : 'people'} on leave
            </Text>
          </View>
          <TouchableOpacity
            style={styles.calendarBtn}
            onPress={() => setShowPicker(true)}
          >
            <Icon name="calendar-outline" size={20} color="#0369a1" />
          </TouchableOpacity>
        </View>

        <View style={styles.dateControls}>
          <TouchableOpacity style={styles.navBtn} onPress={onPrev}>
            <Icon name="chevron-left" size={22} color="#374151" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.todayBtn} onPress={onToday}>
            <Text style={styles.todayText}>Today</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.navBtn} onPress={onNext}>
            <Icon name="chevron-right" size={22} color="#374151" />
          </TouchableOpacity>
        </View>
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

      {/* Employee List */}
      <View style={styles.listContainer}>
        {loading ? (
          <>
            <SkeletonRow />
            <SkeletonRow />
            <SkeletonRow />
          </>
        ) : error ? (
          <View style={styles.emptyWrap}>
            <Icon name="alert-circle-outline" size={48} color="#ef4444" />
            <Text style={styles.errorTitle}>Oops! Something went wrong</Text>
            <Text style={styles.errorMsg}>{error}</Text>
            <TouchableOpacity
              onPress={() => load(selectedDate)}
              style={styles.retryBtn}
            >
              <Text style={styles.retryText}>Try Again</Text>
            </TouchableOpacity>
          </View>
        ) : list.length === 0 ? (
          <View style={styles.emptyWrap}>
            <Icon name="check-circle-outline" size={56} color="#10b981" />
            <Text style={styles.emptyTitle}>Full attendance! 🎉</Text>
            <Text style={styles.emptyText}>
              Everyone is present on this date.
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
            ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 20 }}
          />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
    paddingHorizontal: 16,
    paddingTop: 16,
  },

  // Header
  header: {
    marginBottom: 16,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#0f172a',
    letterSpacing: -0.5,
  },

  // Date Card
  dateCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  dateHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  dateInfo: {
    flex: 1,
  },
  dateDisplay: {
    fontSize: 18,
    fontWeight: '600',
    color: '#0f172a',
    marginBottom: 4,
  },
  dateCount: {
    fontSize: 14,
    color: '#6b7280',
  },
  calendarBtn: {
    width: 40,
    height: 40,
    backgroundColor: '#e0f2fe',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dateControls: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  navBtn: {
    width: 44,
    height: 44,
    backgroundColor: '#f1f5f9',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  todayBtn: {
    flex: 1,
    height: 44,
    backgroundColor: '#0369a1',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 12,
  },
  todayText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 15,
  },

  // List Container
  listContainer: {
    flex: 1,
  },

  // Employee Card
  empCard: {
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 1,
  },
  empTouch: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  // Avatar
  avatarImg: {
    backgroundColor: '#f3f4f6',
    borderWidth: 2,
    borderColor: '#f8fafc',
  },
  avatarPlaceholder: {
    backgroundColor: '#e0e7ff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarInitials: {
    color: '#4338ca',
    fontWeight: '700',
  },

  // Employee Info
  empInfo: {
    flex: 1,
    marginLeft: 12,
    justifyContent: 'center',
  },
  empName: {
    fontWeight: '600',
    color: '#0f172a',
    fontSize: 15,
    marginBottom: 4,
  },
  empMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  empDept: {
    color: '#6b7280',
    fontSize: 13,
    flex: 1,
  },

  // Badge
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    marginLeft: 8,
  },
  badgeText: {
    fontWeight: '600',
    fontSize: 10,
    letterSpacing: 0.5,
  },

  // Empty State
  emptyWrap: {
    paddingVertical: 60,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#0f172a',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyText: {
    color: '#6b7280',
    fontSize: 14,
    textAlign: 'center',
    paddingHorizontal: 32,
  },

  // Error State
  errorTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#0f172a',
    marginTop: 16,
    marginBottom: 8,
  },
  errorMsg: {
    color: '#6b7280',
    fontSize: 14,
    textAlign: 'center',
    paddingHorizontal: 32,
    marginBottom: 16,
  },
  retryBtn: {
    backgroundColor: '#0369a1',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 10,
  },
  retryText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 15,
  },

  // Skeletons
  skelCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f1f5f9',
  },
  skelLineShort: {
    width: 140,
    height: 14,
    backgroundColor: '#f1f5f9',
    borderRadius: 7,
  },
  skelLineTiny: {
    width: 100,
    height: 10,
    backgroundColor: '#f1f5f9',
    borderRadius: 5,
  },
  skelBadge: {
    width: 60,
    height: 28,
    borderRadius: 8,
    backgroundColor: '#f1f5f9',
  },
});
