// // src/modules/admin/dashboard/components/DashboardStatCards.js
import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';

import { fetchAdminDashboardCountsRequest } from '../store/actions';

import {
  selectDashboardLoading,
  selectProjectsCounts,
  selectTasksCounts,
  selectDealsStats,
  selectFollowupsSummary,
} from '../store/selectors';

/**
 * Small visual helper to render a number with label
 */
function StatItem({ label, main, sub, onPress, accent }) {
  return (
    <TouchableOpacity
      style={[styles.card, accent ? { borderLeftColor: accent } : null]}
      onPress={onPress}
      activeOpacity={0.85}
    >
      <View style={styles.cardContent}>
        <Text style={styles.cardLabel}>{label}</Text>
        <Text style={styles.cardMain}>{main}</Text>
        {typeof sub !== 'undefined' && (
          <Text style={styles.cardSub}>{sub}</Text>
        )}
      </View>
    </TouchableOpacity>
  );
}

StatItem.propTypes = {
  label: PropTypes.string.isRequired,
  main: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  sub: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  onPress: PropTypes.func,
  accent: PropTypes.string,
};

/**
 * DashboardStatCards - main exported component
 *
 * props.onPress* handlers are optional callbacks when user taps a card.
 */
export default function DashboardStatCards({
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
    // note: if you prefer polling, you can implement interval here
  }, [dispatch]);

  if (loading && !projects && !tasks && !deals && !followups) {
    return (
      <View style={styles.loadingWrapper}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatItem
        label="Projects"
        main={projects.pendingCount ?? 0}
        sub={`Overdue: ${projects.overdueCount ?? 0}`}
        onPress={onPressProjects}
        accent="#4f46e5"
      />

      <StatItem
        label="Tasks"
        main={tasks.pendingCount ?? 0}
        sub={`Overdue: ${tasks.overdueCount ?? 0}`}
        onPress={onPressTasks}
        accent="#059669"
      />

      <StatItem
        label="Deals"
        main={deals.totalDeals ?? 0}
        sub={`Converted: ${deals.convertedDeals ?? 0}`}
        onPress={onPressDeals}
        accent="#b45309"
      />

      <StatItem
        label="Followups"
        main={followups.pendingCount ?? 0}
        sub={`Upcoming: ${followups.upcomingCount ?? 0}`}
        onPress={onPressFollowups}
        accent="#b91c1c"
      />
    </View>
  );
}

DashboardStatCards.propTypes = {
  onPressProjects: PropTypes.func,
  onPressTasks: PropTypes.func,
  onPressDeals: PropTypes.func,
  onPressFollowups: PropTypes.func,
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: 12, // RN >=0.71 supports gap; otherwise manage margins
    marginVertical: 12,
  },
  card: {
    flexBasis: '48%',
    minHeight: 110,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 14,
    marginBottom: 12,
    // shadow for iOS
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 6 },
    // elevation for Android
    elevation: 3,
    borderLeftWidth: 6,
    borderLeftColor: '#ddd',
  },
  cardContent: {
    flex: 1,
  },
  cardLabel: {
    fontSize: 13,
    color: '#6b7280', // gray-500
    marginBottom: 6,
  },
  cardMain: {
    fontSize: 28,
    fontWeight: '700',
    color: '#111827', // gray-900
  },
  cardSub: {
    marginTop: 6,
    fontSize: 12,
    color: '#6b7280',
  },
  loadingWrapper: {
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
