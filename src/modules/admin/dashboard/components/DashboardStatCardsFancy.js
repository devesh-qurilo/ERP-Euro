// DashboardStatCardsFancy.js
import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Animated,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import SvgRing from './SvgRing';
import { fetchAdminDashboardCountsRequest } from '../store/actions';
import {
  selectDashboardLoading,
  selectProjectsCounts,
  selectTasksCounts,
  selectDealsStats,
  selectFollowupsSummary,
} from '../store/selectors';

/**
 * Animated counter hook with smooth interpolation
 */
function useCountAnimation(value) {
  const anim = React.useRef(new Animated.Value(Number(value) || 0)).current;

  useEffect(() => {
    Animated.spring(anim, {
      toValue: Number(value) || 0,
      friction: 7,
      tension: 40,
      useNativeDriver: false,
    }).start();
  }, [value]);

  return anim;
}

/**
 * Enhanced fancy card component with improved UI
 */
function FancyCard({
  title,
  main,
  sub,
  percent,
  accentStart,
  accentEnd,
  iconName,
  onPress,
  ringColor,
  iconBg,
}) {
  const animValue = useCountAnimation(main);
  const scaleAnim = React.useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.97,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      friction: 3,
      tension: 40,
      useNativeDriver: true,
    }).start();
  };

  const Container = LinearGradient || View;
  const containerProps = LinearGradient
    ? {
        colors: [accentStart || '#4f46e5', accentEnd || '#6366f1'],
        start: { x: 0, y: 0 },
        end: { x: 1, y: 1 },
        style: styles.card,
      }
    : { style: [styles.card, { backgroundColor: accentStart || '#4f46e5' }] };

  return (
    <Animated.View
      style={[
        styles.cardWrapper,
        {
          transform: [{ scale: scaleAnim }],
        },
      ]}
    >
      <TouchableOpacity
        activeOpacity={1}
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
      >
        <Container {...containerProps}>
          {/* Decorative background elements */}
          <View style={styles.bgDecoration1} />
          <View style={styles.bgDecoration2} />

          <View style={styles.cardContent}>
            {/* Header with icon and ring */}
            <View style={styles.cardTop}>
              <View style={styles.iconContainer}>
                <View style={[styles.iconBg, { backgroundColor: iconBg }]}>
                  <Icon
                    name={iconName}
                    size={24}
                    color="rgba(255,255,255,0.95)"
                  />
                </View>
                <Text style={styles.title}>{title}</Text>
              </View>
              <View style={styles.ringContainer}>
                <SvgRing
                  size={52}
                  strokeWidth={5}
                  progress={percent || 0}
                  progressColor={ringColor || '#fff'}
                  bgColor="rgba(255,255,255,0.2)"
                />
                <View style={styles.percentBadge}>
                  <Text style={styles.percentText}>{percent}%</Text>
                </View>
              </View>
            </View>

            {/* Main count */}
            <View style={styles.cardBody}>
              <Animated.Text style={styles.mainCount}>
                {Math.round(animValue._value || main)}
              </Animated.Text>
              {sub ? (
                <View style={styles.subTextContainer}>
                  <Text style={styles.subText}>{sub}</Text>
                </View>
              ) : null}
            </View>

            {/* Footer with arrow */}
            <View style={styles.footer}>
              <Text style={styles.footerText}>View Details</Text>
              <Icon
                name="chevron-right"
                size={16}
                color="rgba(255,255,255,0.8)"
              />
            </View>
          </View>
        </Container>
      </TouchableOpacity>
    </Animated.View>
  );
}

/**
 * DashboardStatCardsFancy - exported component
 */
export default function DashboardStatCardsFancy({
  onPressProjects,
  onPressTasks,
  onPressDeals,
  onPressFollowups,
}) {
  const dispatch = useDispatch();
  const loading = useSelector(selectDashboardLoading);
  const projects = useSelector(selectProjectsCounts);
  const tasks = useSelector(selectTasksCounts);
  const deals = useSelector(selectDealsStats);
  const followups = useSelector(selectFollowupsSummary);

  useEffect(() => {
    dispatch(fetchAdminDashboardCountsRequest());
  }, [dispatch]);

  // compute friendly text + percents
  const projectsTotal =
    Number(projects.pendingCount || 0) + Number(projects.overdueCount || 0) ||
    0;
  const projectsPercent = projectsTotal
    ? Math.round((Number(projects.overdueCount || 0) / projectsTotal) * 100)
    : 0;

  const tasksTotal =
    Number(tasks.pendingCount || 0) + Number(tasks.overdueCount || 0) || 0;
  const tasksPercent = tasksTotal
    ? Math.round((Number(tasks.overdueCount || 0) / tasksTotal) * 100)
    : 0;

  const dealsTotal = Number(deals.totalDeals || 0);
  const dealsPercent = dealsTotal
    ? Math.round((Number(deals.convertedDeals || 0) / dealsTotal) * 100)
    : 0;

  const followupsTotal =
    Number(followups.pendingCount || 0) +
      Number(followups.upcomingCount || 0) || 0;
  const followupsPercent = followupsTotal
    ? Math.round((Number(followups.upcomingCount || 0) / followupsTotal) * 100)
    : 0;

  if (loading) {
    return (
      <View style={styles.loadingWrapper}>
        <ActivityIndicator size="large" color="#6d28d9" />
        <Text style={styles.loadingText}>Loading dashboard...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <FancyCard
          title="Projects"
          main={projects.pendingCount ?? 0}
          sub={`${projects.overdueCount ?? 0} Overdue • ${projectsTotal} Total`}
          percent={projectsPercent}
          accentStart="#7c3aed"
          accentEnd="#5b21b6"
          iconName="folder-multiple"
          iconBg="rgba(255,255,255,0.15)"
          onPress={onPressProjects}
          ringColor="#fbbf24"
        />

        <FancyCard
          title="Tasks"
          main={tasks.pendingCount ?? 0}
          sub={`${tasks.overdueCount ?? 0} Overdue • ${tasksTotal} Total`}
          percent={tasksPercent}
          accentStart="#059669"
          accentEnd="#047857"
          iconName="checkbox-marked-circle"
          iconBg="rgba(255,255,255,0.15)"
          onPress={onPressTasks}
          ringColor="#34d399"
        />

        <FancyCard
          title="Deals"
          main={deals.totalDeals ?? 0}
          sub={`${deals.convertedDeals ?? 0} Converted • ${dealsPercent}% Rate`}
          percent={dealsPercent}
          accentStart="#ea580c"
          accentEnd="#c2410c"
          iconName="handshake"
          iconBg="rgba(255,255,255,0.15)"
          onPress={onPressDeals}
          ringColor="#fdba74"
        />

        <FancyCard
          title="Followups"
          main={followups.pendingCount ?? 0}
          sub={`${
            followups.upcomingCount ?? 0
          } Upcoming • ${followupsTotal} Total`}
          percent={followupsPercent}
          accentStart="#dc2626"
          accentEnd="#b91c1c"
          iconName="bell-ring"
          iconBg="rgba(255,255,255,0.15)"
          onPress={onPressFollowups}
          ringColor="#fca5a5"
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 4,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: 12,
    marginVertical: 8,
  },
  cardWrapper: {
    flexBasis: '48%',
    marginBottom: 4,
  },
  card: {
    minHeight: 170,
    borderRadius: 20,
    overflow: 'hidden',
    elevation: 8,
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 8 },
  },
  cardContent: {
    flex: 1,
    padding: 18,
    position: 'relative',
    zIndex: 1,
  },
  bgDecoration1: {
    position: 'absolute',
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(255,255,255,0.05)',
    top: -40,
    right: -40,
  },
  bgDecoration2: {
    position: 'absolute',
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255,255,255,0.03)',
    bottom: -20,
    left: -20,
  },
  cardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  iconContainer: {
    flexDirection: 'column',
    gap: 8,
  },
  iconBg: {
    width: 48,
    height: 48,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  title: {
    fontSize: 15,
    color: 'rgba(255,255,255,0.95)',
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  ringContainer: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  percentBadge: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  percentText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#fff',
  },
  cardBody: {
    marginBottom: 16,
  },
  mainCount: {
    fontSize: 40,
    fontWeight: '900',
    color: '#fff',
    letterSpacing: -1,
    marginBottom: 6,
  },
  subTextContainer: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  subText: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.95)',
    fontWeight: '600',
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.15)',
  },
  footerText: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.9)',
    fontWeight: '600',
  },
  loadingWrapper: {
    padding: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: '#6b7280',
    fontWeight: '500',
  },
});
