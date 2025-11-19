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
import LinearGradient from 'react-native-linear-gradient'; // optional; if not installed, replace with View and backgroundColor
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'; // optional
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
 * Animated counter hook
 */
function useCountAnimation(value) {
  const anim = React.useRef(new Animated.Value(Number(value) || 0)).current;

  useEffect(() => {
    Animated.timing(anim, {
      toValue: Number(value) || 0,
      duration: 700,
      useNativeDriver: false,
    }).start();
  }, [value]);

  const display = anim.interpolate({
    inputRange: [0, 10000000],
    outputRange: [0, 10000000],
  });

  return anim;
}

/**
 * Single fancy card component
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
}) {
  const animValue = useCountAnimation(main);

  // fallback: if LinearGradient is available, use it otherwise fallback to View
  const Container = LinearGradient ? LinearGradient : View;
  const containerProps = LinearGradient
    ? {
        colors: [accentStart || '#4f46e5', accentEnd || '#6366f1'],
        style: [styles.card, styles.cardGradient],
      }
    : { style: [styles.card, { backgroundColor: accentStart || '#4f46e5' }] };

  return (
    <TouchableOpacity
      activeOpacity={0.9}
      onPress={onPress}
      style={{ flexBasis: '48%' }}
    >
      <Container {...containerProps}>
        <View style={styles.cardTop}>
          <View style={styles.left}>
            {/* {iconName ? (
              <Icon name={iconName} size={22} color="rgba(255,255,255,0.95)" />
            ) : null} */}
            <Text style={styles.title}>{title}</Text>
          </View>
          <SvgRing
            size={48}
            strokeWidth={6}
            progress={percent || 0}
            progressColor={ringColor || '#fff'}
            bgColor="rgba(255,255,255,0.15)"
          />
        </View>

        <View style={styles.cardBody}>
          <Animated.Text style={styles.mainCount}>
            {animValue.interpolate
              ? animValue.interpolate({
                  inputRange: [0, 1000000],
                  outputRange: [0, 1000000],
                }).__getValue
                ? String(
                    Math.round(
                      animValue.__getValue ? animValue.__getValue() : main,
                    ),
                  )
                : String(main)
              : String(main)}
            {/* NOTE: Animated number display is simplified to show the target value when interpolation isn't easily extracted */}
          </Animated.Text>
          {sub ? <Text style={styles.subText}>{sub}</Text> : null}
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Tap to view details</Text>
        </View>
      </Container>
    </TouchableOpacity>
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
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <View style={styles.row}>
      <FancyCard
        title="Projects"
        main={projects.pendingCount ?? 0}
        sub={`Overdue ${projects.overdueCount ?? 0} • Total ${projectsTotal}`}
        percent={projectsPercent}
        accentStart="#6d28d9"
        accentEnd="#544ec7ff"
        iconName="folder-multiple-outline"
        onPress={onPressProjects}
        ringColor="#fc0000ff"
      />

      <FancyCard
        title="Tasks"
        main={tasks.pendingCount ?? 0}
        sub={`Overdue ${tasks.overdueCount ?? 0} • Total ${tasksTotal}`}
        percent={tasksPercent}
        accentStart="#059669"
        accentEnd="#10b981"
        iconName="format-list-checkbox"
        onPress={onPressTasks}
        ringColor="#fff"
      />

      <FancyCard
        title="Deals"
        main={deals.totalDeals ?? 0}
        sub={`Converted ${deals.convertedDeals ?? 0} • Rate ${dealsPercent}%`}
        percent={dealsPercent}
        accentStart="#f97316"
        accentEnd="#f59e0b"
        iconName="handshake-outline"
        onPress={onPressDeals}
        ringColor="#fff"
      />

      <FancyCard
        title="Followups"
        main={followups.pendingCount ?? 0}
        sub={`Upcoming ${
          followups.upcomingCount ?? 0
        } • Total ${followupsTotal}`}
        percent={followupsPercent}
        accentStart="#ef4444"
        accentEnd="#dc2626"
        iconName="bell-outline"
        onPress={onPressFollowups}
        ringColor="#fff"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: 2,
    marginVertical: 2,
  },
  card: {
    minHeight: 150,
    borderRadius: 14,
    padding: 14,
    marginBottom: 12,
    overflow: 'hidden',
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
  },
  cardGradient: {
    // content sits on top of gradient
  },
  cardTop: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  left: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  title: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.95)',
    marginLeft: 8,
    fontWeight: '600',
  },
  cardBody: {
    marginTop: 12,
  },
  mainCount: {
    fontSize: 34,
    fontWeight: '800',
    color: '#fff',
  },
  subText: {
    marginTop: 6,
    color: 'rgba(255,255,255,0.9)',
  },
  footer: {
    marginTop: 14,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.08)',
    paddingTop: 8,
  },
  footerText: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.9)',
  },
  loadingWrapper: {
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
