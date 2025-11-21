// src/modules/admin/birthdays/components/BirthdayWidget.js
import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import LinearGradient from 'react-native-linear-gradient'; // optional
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'; // optional
import { fetchBirthdaysRequest } from '../store/actions';
import {
  selectBirthdays,
  selectBirthdaysLoading,
  selectBirthdaysError,
} from '../store/selectors';
import { useNavigation } from '@react-navigation/native';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

function calcAge(birthdayStr) {
  if (!birthdayStr) return null;
  // birthdayStr is 'YYYY-MM-DD'
  const parts = birthdayStr.split('-');
  if (parts.length < 3) return null;
  const y = Number(parts[0]) || 0;
  const m = Number(parts[1]) || 1;
  const d = Number(parts[2]) || 1;
  const bd = new Date(y, m - 1, d);
  const now = new Date();
  let age = now.getFullYear() - bd.getFullYear();
  const mo = now.getMonth() - bd.getMonth();
  const da = now.getDate() - bd.getDate();
  if (mo < 0 || (mo === 0 && da < 0)) age = age - 1;
  return age;
}

/**
 * Single birthday card
 */
function BirthdayCard({ item, onPressCelebrate, onPressCard }) {
  const cardWidth = Math.min(320, SCREEN_WIDTH - 72);
  const Gradient = LinearGradient ? LinearGradient : View;
  const gradientProps = LinearGradient
    ? {
        colors: ['#fef3c7', '#fde68a'],
        style: [styles.card, { width: cardWidth }],
      }
    : {
        style: [styles.card, { width: cardWidth, backgroundColor: '#fde68a' }],
      };

  const age = calcAge(item.birthday);
  const birthDateDisplay = item.birthday
    ? item.birthday.split('-').slice(1).join('-')
    : '—'; // MM-DD

  return (
    <TouchableOpacity activeOpacity={0.95} onPress={() => onPressCard(item)}>
      <Gradient {...gradientProps}>
        <View style={styles.topRow}>
          <View style={styles.avatarWrap}>
            {item.profilePictureUrl ? (
              <Image
                source={{ uri: item.profilePictureUrl }}
                style={styles.avatar}
              />
            ) : (
              <View style={styles.placeholder}>
                <Icon name="account" size={28} color="#fff" />
              </View>
            )}
          </View>

          <View style={{ flex: 1, marginLeft: 12 }}>
            <Text style={styles.name} numberOfLines={1}>
              {item.name}
            </Text>
            <Text style={styles.designation} numberOfLines={1}>
              {item.designationName
                ? item.designationName
                : item.departmentName ?? ''}
            </Text>
            <Text style={styles.meta}>
              {birthDateDisplay} • {age != null ? `${age} yrs` : '—'}
            </Text>
          </View>

          <TouchableOpacity
            style={styles.celebrateBtn}
            onPress={() => onPressCelebrate(item)}
          >
            <Icon name="cake" size={18} color="#7c2d12" />
            <Text style={styles.celebrateText}>Celebrate</Text>
          </TouchableOpacity>
        </View>

        {item.about ? (
          <Text style={styles.about} numberOfLines={2}>
            {item.about}
          </Text>
        ) : null}
      </Gradient>
    </TouchableOpacity>
  );
}

/**
 * BirthdayWidget - exported component (horizontal carousel)
 */
export default function BirthdayWidget({ maxItems = 6 }) {
  const dispatch = useDispatch();
  const navigation = useNavigation();

  const loading = useSelector(selectBirthdaysLoading);
  const error = useSelector(selectBirthdaysError);
  const list = useSelector(selectBirthdays) || [];

  useEffect(() => {
    dispatch(fetchBirthdaysRequest());
  }, [dispatch]);

  const items = list.slice(0, maxItems);

  const onPressCelebrate = emp => {
    // basic UX: navigate to employee detail OR open a modal / send kudos
    // for now we just navigate to EmployeeDetail route with employeeId
    navigation.navigate('EmployeeDetail', { employeeId: emp.employeeId });
  };

  const onPressCard = emp => {
    navigation.navigate('EmployeeDetail', { employeeId: emp.employeeId });
  };

  const handleViewAll = () => navigation.navigate('Employees');

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.headerTitle}>Employee Birthdays</Text>
        <TouchableOpacity onPress={handleViewAll}>
          <Text style={styles.viewAll}>View all ▸</Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <View style={styles.loader}>
          <ActivityIndicator />
        </View>
      ) : error ? (
        <View style={styles.loader}>
          <Text style={{ color: '#ef4444' }}>{error}</Text>
        </View>
      ) : items.length === 0 ? (
        <View style={styles.empty}>
          <Text style={{ color: '#6b7280' }}>No upcoming birthdays</Text>
        </View>
      ) : (
        <FlatListHorizontal
          data={items}
          renderItem={({ item }) => (
            <BirthdayCard
              item={item}
              onPressCelebrate={onPressCelebrate}
              onPressCard={onPressCard}
            />
          )}
        />
      )}
    </View>
  );
}

/**
 * Small horizontal FlatList wrapper that adds spacing and fast layout
 */
function FlatListHorizontal({ data, renderItem }) {
  return (
    <FlatList
      horizontal
      showsHorizontalScrollIndicator={false}
      data={data}
      keyExtractor={i => i.employeeId || i.email || Math.random().toString()}
      renderItem={renderItem}
      contentContainerStyle={{ paddingHorizontal: 6 }}
      ItemSeparatorComponent={() => <View style={{ width: 12 }} />}
    />
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

  loader: { paddingVertical: 18, alignItems: 'center' },
  empty: { paddingVertical: 18, alignItems: 'center' },

  card: {
    borderRadius: 12,
    padding: 12,
    width: 300,
    minHeight: 110,
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 3,
  },
  topRow: { flexDirection: 'row', alignItems: 'center' },
  avatarWrap: {
    width: 64,
    height: 64,
    borderRadius: 10,
    overflow: 'hidden',
    backgroundColor: '#fff',
  },
  avatar: { width: '100%', height: '100%' },
  placeholder: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#7c2d12',
  },

  name: { fontSize: 16, fontWeight: '800', color: '#7c2d12' },
  designation: { fontSize: 12, color: '#92400e', marginTop: 2 },
  meta: { fontSize: 12, color: '#92400e', marginTop: 4 },

  celebrateBtn: {
    backgroundColor: '#fef3c7',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  celebrateText: {
    color: '#7c2d12',
    fontWeight: '700',
    marginTop: 4,
    fontSize: 12,
  },

  about: { marginTop: 10, color: '#92400e', fontSize: 13 },
});
