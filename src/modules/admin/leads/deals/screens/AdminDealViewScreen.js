import React, { useEffect } from 'react';
import { View, Text, ActivityIndicator, ScrollView } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { fetchOne } from '../../deals/store/actions';
import { selectDealOne } from '../../deals/store/selectors';

export default function AdminDealViewScreen({ route }) {
  const { dealId } = route.params || {};
  const dispatch = useDispatch();
  const deal = useSelector(selectDealOne);

  useEffect(() => {
    if (dealId) dispatch(fetchOne(dealId));
  }, [dealId]);

  if (!deal) return <ActivityIndicator style={{ marginTop: 20 }} />;

  return (
    <ScrollView contentContainerStyle={{ padding: 16 }}>
      <Text style={{ fontSize: 20, fontWeight: '700', marginBottom: 12 }}>
        {deal.title}
      </Text>
      <Text>Value: {deal.value}</Text>
      <Text>Stage: {deal.dealStage}</Text>
      <Text>Pipeline: {deal.pipeline}</Text>
      <Text>Category: {deal.dealCategory}</Text>
      <Text>Agent: {deal.dealAgent}</Text>
      <Text>
        Watchers:{' '}
        {Array.isArray(deal.dealWatchers) ? deal.dealWatchers.join(', ') : ''}
      </Text>
      <Text>Lead ID: {deal.leadId ?? '-'}</Text>

      <View style={{ height: 12 }} />
      <Text style={{ fontWeight: '700' }}>Followups</Text>
      {(deal.followups || []).map((f, i) => (
        <View key={i} style={{ paddingVertical: 8 }}>
          <Text>
            - {f.nextDate} {f.startTime} • {f.status}
          </Text>
          <Text style={{ color: '#666' }}>{f.remarks}</Text>
        </View>
      ))}
    </ScrollView>
  );
}
