import React, { useEffect, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import SvgRing from './SvgRing';
import { fetchTimelogRequest, setTimelogSelectedDate } from '../store/actions';
import {
  selectTimelogLoading,
  selectTimelogSummary,
  selectTimelogEntries,
  selectTimelogSelectedDate,
} from '../store/selectors';
import { useNavigation } from '@react-navigation/native';

// helper to format Date -> YYYY-MM-DD
const toISODate = d => {
  const dt = d instanceof Date ? d : new Date(d);
  const yyyy = dt.getFullYear();
  const mm = `0${dt.getMonth() + 1}`.slice(-2);
  const dd = `0${dt.getDate()}`.slice(-2);
  return `${yyyy}-${mm}-${dd}`;
};

export default function TimeLogMini({ initialDate }) {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const loading = useSelector(selectTimelogLoading);
  const summary = useSelector(selectTimelogSummary);
  const entries = useSelector(selectTimelogEntries);
  const selectedDateFromStore = useSelector(selectTimelogSelectedDate);

  // decide which date to use: store -> prop initial -> today
  const date = selectedDateFromStore ?? initialDate ?? toISODate(new Date());

  // whenever global date changes, trigger fetch (and when component mounts)
  useEffect(() => {
    dispatch(fetchTimelogRequest(date));
  }, [dispatch, date]);

  const totalHours = useMemo(
    () => Math.round((summary.totalHours || 0) * 100) / 100,
    [summary],
  );
  const usedPct =
    summary.usedPct ??
    Math.round(((summary.totalMinutes || 0) / (24 * 60)) * 100);

  const setDateInStore = d => dispatch(setTimelogSelectedDate(d));

  return (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Text style={styles.title}>TimeLog Preview</Text>
        <TouchableOpacity
          onPress={() => navigation.navigate('TimeLog', { date })}
        >
          <Text style={styles.viewAll}>Open ▸</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.body}>
        <View style={styles.ringWrap}>
          <SvgRing
            size={76}
            strokeWidth={6}
            progress={usedPct}
            progressColor="#06b6d4"
            bgColor="rgba(15,23,42,0.08)"
          />
        </View>

        <View style={styles.summary}>
          {loading ? (
            <ActivityIndicator />
          ) : (
            <>
              <Text style={styles.hours}>{totalHours} hrs</Text>
              <Text style={styles.entries}>{entries?.length ?? 0} entries</Text>
              <Text style={styles.small}>Date: {date}</Text>
            </>
          )}
        </View>
      </View>

      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.linkBtn}
          onPress={() => {
            // set global date and navigate to full screen
            setDateInStore(date);
            navigation.navigate('TimeLog', { date });
          }}
        >
          <Text style={styles.linkText}>Open full timelog</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.smallBtn}
          onPress={() => {
            const d = new Date(date);
            d.setDate(d.getDate() - 1);
            setDateInStore(toISODate(d));
          }}
        >
          <Text style={styles.smallBtnText}>Prev</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.smallBtn}
          onPress={() => {
            const d = new Date(date);
            d.setDate(d.getDate() + 1);
            setDateInStore(toISODate(d));
          }}
        >
          <Text style={styles.smallBtnText}>Next</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

// styles same as before (copy or keep)
const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 8,
    marginVertical: 6,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: { fontSize: 14, fontWeight: '800', color: '#0f172a' },
  viewAll: { color: '#6b7280', fontWeight: '700' },

  body: { flexDirection: 'row', alignItems: 'center', marginTop: 12 },
  ringWrap: { width: 90, alignItems: 'center', justifyContent: 'center' },
  summary: { marginLeft: 12 },
  hours: { fontSize: 22, fontWeight: '800', color: '#0f172a' },
  entries: { color: '#6b7280', marginTop: 4 },
  small: { color: '#9ca3af', fontSize: 12, marginTop: 6 },

  footer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    marginTop: 12,
    gap: 8,
  },
  linkBtn: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: '#06b6d4',
    borderRadius: 10,
  },
  linkText: { color: '#022027', fontWeight: '700' },
  smallBtn: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: '#f3f4f6',
    borderRadius: 10,
    marginLeft: 8,
  },
  smallBtnText: { color: '#111827', fontWeight: '700' },
});
