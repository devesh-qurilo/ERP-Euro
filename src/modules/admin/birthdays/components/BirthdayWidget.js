// src/modules/admin/birthdays/components/BirthdayWidget.js
import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  Dimensions,
  Animated,
  Easing,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
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

// Format birthday display
function formatBirthday(birthdayStr) {
  if (!birthdayStr) return '—';
  const parts = birthdayStr.split('-');
  if (parts.length < 3) return '—';
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
  const month = months[parseInt(parts[1]) - 1] || '—';
  const day = parseInt(parts[2]);
  return `${month} ${day}`;
}

/**
 * Single birthday card with animation
 */
function BirthdayCard({ item, onPressCelebrate, onPressCard, index }) {
  const cardWidth = Math.min(280, SCREEN_WIDTH - 64);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(20)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 400,
        delay: index * 80,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 400,
        delay: index * 80,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }),
    ]).start();
  }, [fadeAnim, slideAnim, index]);

  const age = calcAge(item.birthday);
  const birthDateDisplay = formatBirthday(item.birthday);

  return (
    <Animated.View
      style={{
        opacity: fadeAnim,
        transform: [{ translateX: slideAnim }],
      }}
    >
      <TouchableOpacity activeOpacity={0.9} onPress={() => onPressCard(item)}>
        <LinearGradient
          colors={['#fef3c7', '#fde68a', '#fcd34d']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[styles.card, { width: cardWidth }]}
        >
          {/* Decorative cake icon in background */}
          <View style={styles.bgIcon}>
            <Icon name="cake-variant" size={80} color="#fef3c7" />
          </View>

          <View style={styles.cardContent}>
            {/* Avatar and Info */}
            <View style={styles.topSection}>
              <View style={styles.avatarContainer}>
                {item.profilePictureUrl ? (
                  <Image
                    source={{ uri: item.profilePictureUrl }}
                    style={styles.avatar}
                  />
                ) : (
                  <View style={styles.placeholder}>
                    <Text style={styles.placeholderText}>
                      {(item.name || '')
                        .split(' ')
                        .map(s => s[0])
                        .slice(0, 2)
                        .join('')
                        .toUpperCase()}
                    </Text>
                  </View>
                )}
                {/* Birthday badge */}
                <View style={styles.birthdayBadge}>
                  <Icon name="gift" size={12} color="#fff" />
                </View>
              </View>

              <View style={styles.infoSection}>
                <Text style={styles.name} numberOfLines={1}>
                  {item.name}
                </Text>
                <Text style={styles.designation} numberOfLines={1}>
                  {item.designationName || item.departmentName || 'Employee'}
                </Text>

                {/* Birthday date and age */}
                <View style={styles.dateRow}>
                  <View style={styles.dateChip}>
                    <Icon name="calendar-today" size={12} color="#92400e" />
                    <Text style={styles.dateText}>{birthDateDisplay}</Text>
                  </View>
                  {age != null && (
                    <View style={styles.ageChip}>
                      <Text style={styles.ageText}>Turns {age}</Text>
                    </View>
                  )}
                </View>
              </View>
            </View>

            {/* About section */}
            {item.about ? (
              <Text style={styles.about} numberOfLines={2}>
                "{item.about}"
              </Text>
            ) : null}

            {/* Celebrate button */}
            <TouchableOpacity
              style={styles.celebrateBtn}
              onPress={() => onPressCelebrate(item)}
              activeOpacity={0.8}
            >
              <Icon name="party-popper" size={16} color="#fff" />
              <Text style={styles.celebrateText}>Send Wishes</Text>
              <Icon name="chevron-right" size={16} color="#fff" />
            </TouchableOpacity>
          </View>
        </LinearGradient>
      </TouchableOpacity>
    </Animated.View>
  );
}

/**
 * Skeleton card for loading state
 */
function SkeletonCard() {
  const cardWidth = Math.min(280, SCREEN_WIDTH - 64);
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
    <Animated.View style={[styles.card, { width: cardWidth, opacity: anim }]}>
      <View style={styles.cardContent}>
        <View style={styles.topSection}>
          <View style={styles.skelAvatar} />
          <View style={styles.infoSection}>
            <View style={styles.skelName} />
            <View style={styles.skelDesignation} />
            <View style={styles.skelDate} />
          </View>
        </View>
        <View style={styles.skelButton} />
      </View>
    </Animated.View>
  );
}

/**
 * BirthdayWidget - exported component
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
    navigation.navigate('EmployeeDetail', { employeeId: emp.employeeId });
  };

  const onPressCard = emp => {
    navigation.navigate('EmployeeDetail', { employeeId: emp.employeeId });
  };

  const handleViewAll = () => navigation.navigate('Employees');

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.headerRow}>
        <View style={styles.headerLeft}>
          <Icon name="cake-variant" size={24} color="#f59e0b" />
          <Text style={styles.headerTitle}>Birthdays</Text>
          {items.length > 0 && (
            <View style={styles.countBadge}>
              <Text style={styles.countText}>{items.length}</Text>
            </View>
          )}
        </View>
        <TouchableOpacity onPress={handleViewAll} style={styles.viewAllBtn}>
          <Text style={styles.viewAllText}>View all</Text>
          <Icon name="chevron-right" size={16} color="#0369a1" />
        </TouchableOpacity>
      </View>

      {/* Content */}
      {loading ? (
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={[1, 2]}
          keyExtractor={(_, i) => `skeleton-${i}`}
          renderItem={() => <SkeletonCard />}
          contentContainerStyle={styles.listContent}
          ItemSeparatorComponent={() => <View style={{ width: 12 }} />}
        />
      ) : error ? (
        <View style={styles.errorContainer}>
          <Icon name="alert-circle-outline" size={40} color="#ef4444" />
          <Text style={styles.errorText}>Failed to load birthdays</Text>
          <TouchableOpacity
            onPress={() => dispatch(fetchBirthdaysRequest())}
            style={styles.retryBtn}
          >
            <Text style={styles.retryText}>Retry</Text>
          </TouchableOpacity>
        </View>
      ) : items.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Icon name="calendar-check" size={48} color="#10b981" />
          <Text style={styles.emptyTitle}>No birthdays coming up</Text>
          <Text style={styles.emptyText}>
            Check back later for upcoming celebrations
          </Text>
        </View>
      ) : (
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={items}
          keyExtractor={i =>
            i.employeeId || i.email || Math.random().toString()
          }
          renderItem={({ item, index }) => (
            <BirthdayCard
              item={item}
              index={index}
              onPressCelebrate={onPressCelebrate}
              onPressCard={onPressCard}
            />
          )}
          contentContainerStyle={styles.listContent}
          ItemSeparatorComponent={() => <View style={{ width: 12 }} />}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
    marginBottom: 12,
  },

  // Header
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    paddingHorizontal: 16,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#0f172a',
  },
  countBadge: {
    backgroundColor: '#fef3c7',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#fde68a',
  },
  countText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#92400e',
  },
  viewAllBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#e0f2fe',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    gap: 4,
  },
  viewAllText: {
    color: '#0369a1',
    fontWeight: '600',
    fontSize: 13,
  },

  // List
  listContent: {
    paddingHorizontal: 16,
  },

  // Card
  card: {
    borderRadius: 16,
    minHeight: 200,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
    overflow: 'hidden',
  },
  bgIcon: {
    position: 'absolute',
    right: -20,
    bottom: -20,
    opacity: 0.15,
  },
  cardContent: {
    padding: 16,
    flex: 1,
    justifyContent: 'space-between',
  },

  // Top section
  topSection: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  avatarContainer: {
    position: 'relative',
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 16,
    backgroundColor: '#fff',
    borderWidth: 3,
    borderColor: '#fff',
  },
  placeholder: {
    width: 64,
    height: 64,
    borderRadius: 16,
    backgroundColor: '#b45309',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: '#fff',
  },
  placeholderText: {
    fontSize: 20,
    fontWeight: '700',
    color: '#fff',
  },
  birthdayBadge: {
    position: 'absolute',
    bottom: -4,
    right: -4,
    backgroundColor: '#ef4444',
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#fff',
  },

  // Info section
  infoSection: {
    flex: 1,
    marginLeft: 12,
  },
  name: {
    fontSize: 16,
    fontWeight: '700',
    color: '#78350f',
    marginBottom: 2,
  },
  designation: {
    fontSize: 13,
    color: '#92400e',
    marginBottom: 8,
  },
  dateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    flexWrap: 'wrap',
  },
  dateChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    gap: 4,
  },
  dateText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#92400e',
  },
  ageChip: {
    backgroundColor: '#fff',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  ageText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#92400e',
  },

  // About
  about: {
    fontSize: 13,
    color: '#78350f',
    fontStyle: 'italic',
    marginBottom: 12,
    lineHeight: 18,
  },

  // Celebrate button
  celebrateBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#b45309',
    paddingVertical: 12,
    borderRadius: 12,
    gap: 6,
  },
  celebrateText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },

  // Empty state
  emptyContainer: {
    paddingVertical: 40,
    paddingHorizontal: 32,
    alignItems: 'center',
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0f172a',
    marginTop: 12,
    marginBottom: 6,
  },
  emptyText: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
  },

  // Error state
  errorContainer: {
    paddingVertical: 40,
    paddingHorizontal: 32,
    alignItems: 'center',
  },
  errorText: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 12,
    marginBottom: 16,
  },
  retryBtn: {
    backgroundColor: '#0369a1',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 10,
  },
  retryText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },

  // Skeleton
  skelAvatar: {
    width: 64,
    height: 64,
    borderRadius: 16,
    backgroundColor: '#f1f5f9',
  },
  skelName: {
    width: 120,
    height: 16,
    backgroundColor: '#f1f5f9',
    borderRadius: 8,
    marginBottom: 8,
  },
  skelDesignation: {
    width: 90,
    height: 12,
    backgroundColor: '#f1f5f9',
    borderRadius: 6,
    marginBottom: 8,
  },
  skelDate: {
    width: 70,
    height: 12,
    backgroundColor: '#f1f5f9',
    borderRadius: 6,
  },
  skelButton: {
    width: '100%',
    height: 44,
    backgroundColor: '#f1f5f9',
    borderRadius: 12,
    marginTop: 12,
  },
});
