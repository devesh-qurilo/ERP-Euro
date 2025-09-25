import React, { useEffect, useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Pressable,
  Modal,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { fetchNotifications, markNotificationRead } from '../store/actions';
import {
  selectNotifs,
  selectNotifsLoading,
  selectNotifsError,
  selectMarkingMap,
} from '../store/selectors';
import NotificationItem from '../components/NotificationItem';
import { useFocusEffect } from '@react-navigation/native';

export default function EmployeeNotificationsScreen() {
  const dispatch = useDispatch();
  const notifs = useSelector(selectNotifs);
  const loading = useSelector(selectNotifsLoading);
  const error = useSelector(selectNotifsError);
  const marking = useSelector(selectMarkingMap);

  // fetch on mount + refetch when screen focused
  useEffect(() => {
    dispatch(fetchNotifications());
  }, [dispatch]);
  useFocusEffect(
    React.useCallback(() => {
      dispatch(fetchNotifications());
    }, [dispatch]),
  );

  const [filter, setFilter] = useState('all'); // all | unread
  const filtered = useMemo(
    () => (filter === 'unread' ? notifs.filter(n => !n.readFlag) : notifs),
    [notifs, filter],
  );

  // detail modal
  const [open, setOpen] = useState(false);
  const [current, setCurrent] = useState(null);
  const openDetail = n => {
    setCurrent(n);
    setOpen(true);
  };

  const markRead = id => dispatch(markNotificationRead(id));

  return (
    <View style={styles.wrap}>
      <View style={styles.toolbar}>
        <Pressable
          onPress={() => setFilter('all')}
          style={[styles.tab, filter === 'all' && styles.tabActive]}
        >
          <Text
            style={[styles.tabTxt, filter === 'all' && styles.tabTxtActive]}
          >
            All
          </Text>
        </Pressable>
        <Pressable
          onPress={() => setFilter('unread')}
          style={[styles.tab, filter === 'unread' && styles.tabActive]}
        >
          <Text
            style={[styles.tabTxt, filter === 'unread' && styles.tabTxtActive]}
          >
            Unread
          </Text>
        </Pressable>
      </View>

      {error ? <Text style={styles.err}>Error: {String(error)}</Text> : null}
      {loading ? <Text style={styles.note}>Loading…</Text> : null}

      <FlatList
        data={filtered}
        keyExtractor={it => String(it.id)}
        contentContainerStyle={{ padding: 16, paddingTop: 8 }}
        renderItem={({ item }) => (
          <NotificationItem item={item} onPress={openDetail} />
        )}
        ListEmptyComponent={
          !loading ? <Text style={styles.note}>No notifications.</Text> : null
        }
      />

      {/* Detail modal */}
      <Modal
        transparent
        visible={open}
        animationType="fade"
        onRequestClose={() => setOpen(false)}
      >
        <View style={styles.backdrop}>
          <View style={styles.modalCard}>
            <Text style={styles.title}>{current?.title}</Text>
            <View style={styles.msgWrap}>
              {' '}
              <Text style={styles.message}>{current?.message}</Text>
            </View>
            <View style={styles.actions}>
              <Pressable style={styles.ghostBtn} onPress={() => setOpen(false)}>
                <Text style={styles.ghostTxt}>Close</Text>
              </Pressable>
              {!current?.readFlag && (
                <Pressable
                  style={styles.primaryBtn}
                  onPress={() => {
                    markRead(current.id);
                    setOpen(false);
                  }}
                  disabled={!!marking[current?.id]}
                >
                  <Text style={styles.primaryTxt}>
                    {marking[current?.id] ? 'Marking…' : 'Mark as Read'}
                  </Text>
                </Pressable>
              )}
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { flex: 1, backgroundColor: '#f3f4f6' },
  toolbar: {
    flexDirection: 'row',
    gap: 10,
    padding: 12,
    justifyContent: 'flex-start',
  },
  tab: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: '#e5e7eb',
  },
  tabActive: { backgroundColor: '#111827' },
  tabTxt: { color: '#111827', fontWeight: '800' },
  tabTxtActive: { color: '#fff' },

  note: { color: '#6b7280', textAlign: 'center', marginTop: 20 },
  err: { color: '#b00020', textAlign: 'center', marginTop: 10 },

  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.35)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  modalCard: {
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 14,
  },
  msgWrap: { maxHeight: 240, marginTop: 6 },
  title: { fontSize: 18, fontWeight: '900', color: '#111827', marginBottom: 8 },
  message: { color: '#1f2328' },
  actions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 10,
    marginTop: 12,
  },
  ghostBtn: {
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 12,
    backgroundColor: '#f3f4f6',
  },
  ghostTxt: { color: '#111827', fontWeight: '800' },
  primaryBtn: {
    backgroundColor: '#2c7be5',
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 12,
  },
  primaryTxt: { color: '#fff', fontWeight: '900' },
});
