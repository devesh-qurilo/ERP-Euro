// src/modules/admin/dashboard/screens/AdminDashboardScreen.js
import React, { useState } from 'react';
import {
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Platform,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import DateTimePicker from '@react-native-community/datetimepicker';

import DashboardStatCardsFancy from '../components/DashboardStatCardsFancy';
import TimeLogMini from '../../timelog/components/TimeLogMini';
import { setTimelogSelectedDate } from '../../timelog/store/actions';
import { selectTimelogSelectedDate } from '../../timelog/store/selectors';
import { SafeAreaView } from 'react-native-safe-area-context';
import TaskTablePreview from '../components/TaskTablePreview';
import BirthdayWidget from '../../birthdays/components/BirthdayWidget';
import AppreciationsTableCompact from '../../appreciations/components/AppreciationsTableCompact';

import LeaveCalendarWidgetFancy from '../../leaves/components/LeaveCalendarWidgetFancy';
import WorkFromHomeWidgetFancy from '../../wfh/components/WorkFromHomeWidgetFancy';
import ProfileCardDashboard from '../../profile/components/ProfileCardDashboard';

// helper: Date -> YYYY-MM-DD
const toISODate = d => {
  const dt = d instanceof Date ? d : new Date(d);
  const yyyy = dt.getFullYear();
  const mm = `0${dt.getMonth() + 1}`.slice(-2);
  const dd = `0${dt.getDate()}`.slice(-2);
  return `${yyyy}-${mm}-${dd}`;
};

export default function AdminDashboardScreen({ navigation }) {
  const dispatch = useDispatch();
  const globalSelectedDate = useSelector(selectTimelogSelectedDate); // may be null

  // local UI state for date picker and display
  const today = toISODate(new Date());
  const [showPicker, setShowPicker] = useState(false);
  const [localDate, setLocalDate] = useState(globalSelectedDate ?? today);

  // when localDate changes we update the global store
  const setDate = isoDate => {
    setLocalDate(isoDate);
    dispatch(setTimelogSelectedDate(isoDate));
  };

  const onPrev = () => {
    const d = new Date(localDate);
    d.setDate(d.getDate() - 1);
    setDate(toISODate(d));
  };

  const onNext = () => {
    const d = new Date(localDate);
    d.setDate(d.getDate() + 1);
    setDate(toISODate(d));
  };

  const onToday = () => setDate(today);

  const onPick = (event, dt) => {
    // Android: event.type==='set' | 'dismissed' ; iOS returns Date directly
    setShowPicker(Platform.OS === 'ios'); // keep on ios
    if (!dt && event?.type === 'set' && event?.nativeEvent?.timestamp) {
      dt = new Date(event.nativeEvent.timestamp);
    }
    if (dt) {
      setDate(toISODate(dt));
    }
  };

  // If store changes from elsewhere, sync localDate
  React.useEffect(() => {
    if (globalSelectedDate && globalSelectedDate !== localDate) {
      setLocalDate(globalSelectedDate);
    }
  }, [globalSelectedDate]);

  return (
    // <SafeAreaView style={styles.safe}>
    <ScrollView contentContainerStyle={styles.container}>
      <View style={{ marginTop: 1 }}>
        <ProfileCardDashboard compact={false} />
      </View>

      <Text>decvesg 00008101-001C696A1861401E</Text>
      {/* Fancy stat cards */}
      <DashboardStatCardsFancy />

      {/* Date control (global) */}
      <View style={styles.dateRow}>
        <TouchableOpacity style={styles.smallBtn} onPress={onPrev}>
          <Text style={styles.smallBtnText}>‹ Prev</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.dateBtn}
          onPress={() => setShowPicker(true)}
        >
          <Text style={styles.dateText}>{localDate}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.smallBtn} onPress={onNext}>
          <Text style={styles.smallBtnText}>Next ›</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.todayBtn} onPress={onToday}>
          <Text style={styles.todayText}>Today</Text>
        </TouchableOpacity>
      </View>

      {showPicker && (
        <DateTimePicker
          value={new Date(localDate)}
          mode="date"
          display="default"
          onChange={onPick}
          maximumDate={new Date(2100, 0, 1)}
          minimumDate={new Date(2000, 0, 1)}
        />
      )}

      {/* Compact timelog preview — it reads selectedDate from store and auto-fetches */}
      <View style={styles.section}>
        <TimeLogMini initialDate={localDate} />
      </View>

      <View style={{ marginTop: 12 }}>
        <TaskTablePreview initialSource={{ kind: 'assigned' }} />
      </View>

      {/* You can add more dashboard components here (charts, lists, etc.) */}
      {/* <BirthdayWidget /> */}
      <View style={{ marginTop: 12 }}>
        <BirthdayWidget />
      </View>
      <View style={{ marginTop: 12 }}>
        <AppreciationsTableCompact
          maxRows={6}
          onRowPress={row =>
            navigation.navigate('AppreciationDetail', { id: row.id })
          }
        />
      </View>

      <View style={{ marginTop: 12 }}>
        <LeaveCalendarWidgetFancy />
      </View>
      <View style={{ marginTop: 12 }}>
        <WorkFromHomeWidgetFancy />
      </View>
    </ScrollView>
    // </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { backgroundColor: '#e6e6e6ff' },
  container: { paddingHorizontal: 10, marginBottom: 20 },
  dateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    gap: 8,
  },
  smallBtn: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: '#fff',
    borderRadius: 8,
    elevation: 1,
  },
  smallBtnText: { color: '#111827', fontWeight: '700' },
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
  section: { marginTop: 12 },
});
