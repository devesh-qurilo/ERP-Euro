// /src/modules/admin/messages/screens/AdminEmployeeViewScreen.js
import React, { useEffect, useMemo, useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  Pressable,
  ActivityIndicator,
  Platform,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Feather';
import { useDispatch, useSelector } from 'react-redux';

import Avatar from '../components/Avatar';
import EmployeeRow from '../components/EmployeeRow';
import ChatRow from '../components/ChatRow';

import { fetchEmployees } from '../../hr/employees/store/actions';
import { selectEmpList } from '../../hr/employees/store/selectors';
import { fetchAdminRooms } from '../store/actions';
import {
  selectAdminRooms,
  selectAdminRoomsLoading,
  selectPresence,
} from '../store/selectors';
import { timeAgo } from '../../../../utils/time';

function normalize(s = '') {
  return s.toString().replace(/\s+/g, ' ').trim().toLowerCase();
}

export default function AdminMessageViewScreen({ navigation }) {
  const dispatch = useDispatch();

  // top-level selectors only (NO hooks inside renderItem)
  const employees = useSelector(selectEmpList) || [];
  const rooms = useSelector(selectAdminRooms) || [];
  const roomsLoading = useSelector(selectAdminRoomsLoading);
  const presenceMap = useSelector(selectPresence); // { [employeeId]: { online, lastActive } }

  const [query, setQuery] = useState('');
  const [debounced, setDebounced] = useState('');

  useEffect(() => {
    const t = setTimeout(() => setDebounced(query.trim()), 250);
    return () => clearTimeout(t);
  }, [query]);

  useEffect(() => {
    dispatch(fetchEmployees({ page: 0, size: 500 }));
    dispatch(fetchAdminRooms());
  }, [dispatch]);

  const filtered = useMemo(() => {
    const q = normalize(debounced);
    if (!q) return employees;
    return employees.filter(emp => {
      return (
        normalize(emp.name || '').includes(q) ||
        normalize(emp.employeeId || '').includes(q)
      );
    });
  }, [employees, debounced]);

  const openRoomFromEmployee = useCallback(
    emp => {
      const participant = {
        employeeId: emp.employeeId,
        name: emp.name,
        profileUrl:
          emp.employeePictureUrl ||
          emp.profileUrl ||
          emp.profilePictureUrl ||
          null,
        designation: emp.designation,
        department: emp.department,
      };

      const found = rooms.find(r => {
        const p1 = (r.participant1Details || {}).employeeId;
        const p2 = (r.participant2Details || {}).employeeId;
        return p1 === emp.employeeId || p2 === emp.employeeId;
      });

      navigation.navigate('AdminMessageRoom', {
        chatRoomId: found ? found.id : `${emp.employeeId}_NEW`,
        participant,
      });
    },
    [navigation, rooms],
  );

  const openRoomFromRoom = useCallback(
    room => {
      const p1 = room.participant1Details || {};
      const p2 = room.participant2Details || {};
      const participant =
        p2.employeeId && p2.employeeId !== p1.employeeId ? p2 : p1;
      navigation.navigate('AdminMessageRoom', {
        chatRoomId: room.id,
        participant: {
          employeeId: participant.employeeId,
          name: participant.name,
          profileUrl:
            participant.profileUrl || participant.profilePictureUrl || null,
          designation: participant.designation,
          department: participant.department,
        },
      });
    },
    [navigation],
  );

  const showSearch = debounced.length > 0;

  // renderItem uses pre-fetched presenceMap (NO hooks here)
  const renderEmployee = ({ item }) => {
    const presence = (presenceMap && presenceMap[item.employeeId]) || {
      online: false,
      lastActive: null,
    };
    const presenceLabel = presence.online
      ? 'Online'
      : presence.lastActive
      ? `Last active ${timeAgo(presence.lastActive)}`
      : '';
    // Pass subtitle prop if your EmployeeRow supports it, otherwise adapt to your component
    return (
      <EmployeeRow
        employee={item}
        onPress={openRoomFromEmployee}
        subtitle={presenceLabel}
      />
    );
  };

  return (
    <View style={styles.container}>
      <LinearGradient colors={['#EFF6FF', '#FFFFFF']} style={styles.header}>
        <Text style={styles.headerTitle}>Messages</Text>
        <Text style={styles.headerSubtitle}>
          Search employees or recent chats
        </Text>
      </LinearGradient>

      <View style={styles.searchWrap}>
        <View style={styles.searchInner}>
          <Icon name="search" size={18} color="#64748B" />
          <TextInput
            placeholder="Search name or ID..."
            placeholderTextColor="#94A3B8"
            value={query}
            onChangeText={t => setQuery(t)}
            style={styles.searchInput}
            clearButtonMode="while-editing"
          />
          {!!query && (
            <Pressable
              onPress={() => {
                setQuery('');
                setDebounced('');
              }}
              style={styles.clearBtn}
            >
              <Icon name="x" size={16} color="#64748B" />
            </Pressable>
          )}
        </View>
      </View>

      <View style={styles.content}>
        {showSearch ? (
          <>
            <Text style={styles.sectionTitle}>
              Employees ({filtered.length})
            </Text>
            <FlatList
              data={filtered}
              keyExtractor={i =>
                i.employeeId || i.id || Math.random().toString()
              }
              renderItem={renderEmployee}
              ItemSeparatorComponent={() => <View style={{ height: 8 }} />}
              contentContainerStyle={{ paddingBottom: 24 }}
              showsVerticalScrollIndicator={false}
              ListEmptyComponent={() => (
                <Text style={styles.emptyText}>No employees found</Text>
              )}
            />
          </>
        ) : (
          <>
            <View style={styles.recentHeader}>
              <Text style={styles.sectionTitle}>Recent Chats</Text>
              {roomsLoading ? (
                <ActivityIndicator size="small" color="#2563EB" />
              ) : null}
            </View>

            <FlatList
              data={[...(rooms || [])].sort(
                (a, b) =>
                  new Date(b.updatedAt).getTime() -
                  new Date(a.updatedAt).getTime(),
              )}
              keyExtractor={item => item.id}
              renderItem={({ item }) => (
                <ChatRow room={item} onPress={openRoomFromRoom} />
              )}
              ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
              ListEmptyComponent={() => (
                <Text style={styles.emptyText}>No recent chats</Text>
              )}
              contentContainerStyle={{ paddingBottom: 24 }}
              showsVerticalScrollIndicator={false}
            />
          </>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },
  header: { paddingVertical: 18, paddingHorizontal: 16 },
  headerTitle: { fontSize: 22, fontWeight: '800', color: '#0F172A' },
  headerSubtitle: { fontSize: 13, color: '#475569', marginTop: 2 },
  searchWrap: { paddingHorizontal: 16, marginTop: 12 },
  searchInner: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: Platform.OS === 'ios' ? 12 : 10,
    borderRadius: 12,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#E6EEF8',
  },
  searchInput: { marginLeft: 10, flex: 1, fontSize: 15, color: '#0F172A' },
  clearBtn: { padding: 6 },
  content: { paddingHorizontal: 16, paddingTop: 12, flex: 1 },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 10,
  },
  recentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  emptyText: { textAlign: 'center', color: '#94A3B8', marginTop: 20 },
});
