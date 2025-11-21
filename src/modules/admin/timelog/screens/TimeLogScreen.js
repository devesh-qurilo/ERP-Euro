// src/modules/admin/timelog/screens/TimeLogScreen.js
import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
  RefreshControl,
  FlatList,
  SafeAreaView,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import DateTimePicker from '@react-native-community/datetimepicker'; // optional but recommended
import TimeLogFancy from '../components/TimeLogFancy';
import TimeLogDetailModal from '../components/TimeLogDetailModal';
import { fetchTimelogRequest } from '../store/actions';
import {
  selectTimelogEntries,
  selectTimelogSummary,
  selectTimelogLoading,
  selectTimelogDate,
} from '../store/selectors';

// helper to format date to YYYY-MM-DD
const toISODate = d => {
  const dt = d instanceof Date ? d : new Date(d);
  const yyyy = dt.getFullYear();
  const mm = `0${dt.getMonth() + 1}`.slice(-2);
  const dd = `0${dt.getDate()}`.slice(-2);
  return `${yyyy}-${mm}-${dd}`;
};

export default function TimeLogScreen({ navigation }) {
  const dispatch = useDispatch();
  const entries = useSelector(selectTimelogEntries);
  const summary = useSelector(selectTimelogSummary);
  const loading = useSelector(selectTimelogLoading);
  // the timelog reducer stores date on request; but we maintain local selectedDate for UI control
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showPicker, setShowPicker] = useState(false);
  const [detailItem, setDetailItem] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  const dateStr = toISODate(selectedDate);

  // fetch when date changes
  useEffect(() => {
    dispatch(fetchTimelogRequest(dateStr));
  }, [dispatch, dateStr]);

  // pull-to-refresh handler
  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await dispatch(fetchTimelogRequest(dateStr));
    // small delay to show refresh indicator nicely
    setTimeout(() => setRefreshing(false), 600);
  }, [dispatch, dateStr]);

  const onPrevDay = () => {
    const prev = new Date(selectedDate);
    prev.setDate(prev.getDate() - 1);
    setSelectedDate(prev);
  };
  const onNextDay = () => {
    const nxt = new Date(selectedDate);
    nxt.setDate(nxt.getDate() + 1);
    setSelectedDate(nxt);
  };
  const onToday = () => setSelectedDate(new Date());

  const onChangePicker = (event, dt) => {
    setShowPicker(Platform.OS === 'ios'); // keep open on ios modal style
    if (dt) setSelectedDate(dt);
  };

  // open detail modal
  const onPressEntry = item => {
    setDetailItem(item);
  };

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.btn} onPress={onPrevDay}>
          <Text style={styles.btnText}>‹ Prev</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.dateBtn}
          onPress={() => setShowPicker(true)}
        >
          <Text style={styles.dateText}>{dateStr}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.btn} onPress={onNextDay}>
          <Text style={styles.btnText}>Next ›</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.todayBtn} onPress={onToday}>
          <Text style={styles.todayText}>Today</Text>
        </TouchableOpacity>
      </View>

      {showPicker && (
        <DateTimePicker
          value={selectedDate}
          mode="date"
          display="default"
          onChange={onChangePicker}
          maximumDate={new Date(2100, 0, 1)}
          minimumDate={new Date(2000, 0, 1)}
        />
      )}

      {/* Fancy summary + list component (we reuse the component created earlier but pass dynamic date and onPress handler) */}
      <View style={styles.content}>
        <TimeLogFancy
          date={dateStr}
          onPressEntry={onPressEntry}
          // internal component handles its own dispatch; parent can also trigger refresh via key change
        />

        {/* Detail modal */}
        <TimeLogDetailModal
          visible={!!detailItem}
          item={detailItem}
          onClose={() => setDetailItem(null)}
          onEdit={it => {
            setDetailItem(null);
            // navigate to an edit screen or open edit modal (implement as needed)
            navigation?.navigate?.('TimeLogEdit', { item: it });
          }}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#f8fafc' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    gap: 8,
  },
  btn: {
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 8,
    backgroundColor: '#fff',
    elevation: 1,
  },
  btnText: { color: '#111827', fontWeight: '700' },
  dateBtn: {
    flex: 1,
    marginHorizontal: 8,
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  dateText: { color: '#0f172a', fontWeight: '700' },
  todayBtn: {
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 8,
    backgroundColor: '#06b6d4',
  },
  todayText: { color: '#011827', fontWeight: '700' },
  content: { flex: 1, paddingHorizontal: 12 },
});
