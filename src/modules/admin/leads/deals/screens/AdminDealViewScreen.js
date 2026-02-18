import React, { useEffect, useState } from 'react';
import { KeyboardAvoidingView, Platform } from 'react-native';

import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { fetchOne } from '../../deals/store/actions';
import { selectDealOne } from '../../deals/store/selectors';
import FollowupsTab from '../components/FollowupsTab';
import { selectEmpList } from '../../../hr/employees/store/selectors';
import { fetchEmployees } from '../../../hr/employees/store/actions';
import {
  fetchDocs,
  fetchFollowups,
  fetchNotes,
  fetchComments,
  fetchTags,
} from '../../deals/view/store/actions';
import { selectDealTabsBusy } from '../../deals/view/store/selectors';
import DealPrimarySection from '../components/DealPrimarySection';
import DocumentsTab from '../components/DocumentsTab';
import DealCommentsSection from '../components/DealCommentsSection';
import DealPeopleSection from '../components/DealPeopleSection';
import DealNotesSection from '../components/DealNotesSection';
import DealTagsSection from '../components/DealTagsSection';

export default function AdminDealViewScreen({ route }) {
  const { dealId } = route.params || {};
  const dispatch = useDispatch();

  const deal = useSelector(selectDealOne);
  const busy = useSelector(selectDealTabsBusy);
  const employees = useSelector(selectEmpList);

  // tabs
  const tabs = [
    'documents',
    'Follow up',
    'People',
    'Notes',
    'Comments',
    'Tags',
  ];
  const [active, setActive] = useState('documents');

  useEffect(() => {
    if (!dealId) return;

    dispatch(fetchOne(dealId));
    console.log('devvvvvvv', deal);
  }, [dealId]);

  useEffect(() => {
    dispatch(fetchEmployees());
  }, [dispatch]);

  useEffect(() => {
    if (!dealId) return;

    if (active === 'documents') dispatch(fetchDocs(dealId));
    if (active === 'Follow up') dispatch(fetchFollowups(dealId));
    if (active === 'Notes') dispatch(fetchNotes(dealId));
    if (active === 'Comments') dispatch(fetchComments(dealId));
    if (active === 'Tags') dispatch(fetchTags(dealId));
  }, [active, dealId]);

  if (!deal) return <ActivityIndicator style={{ marginTop: 20 }} />;

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={90}
    >
      <ScrollView
        contentContainerStyle={{ padding: 12, paddingBottom: 120 }}
        keyboardShouldPersistTaps="handled"
      >
        <DealPrimarySection deal={deal} />

        {/* Tabs header */}
        <View style={{ borderWidth: 1, borderRadius: 12, paddingTop: 8 }}>
          <View
            style={{
              flexDirection: 'row',
              gap: 16,
              paddingHorizontal: 12,
              marginBottom: 8,
              flexWrap: 'wrap',
            }}
          >
            {tabs.map(t => (
              <TouchableOpacity
                key={t}
                onPress={() => setActive(t)}
                style={{
                  paddingVertical: 8,
                  borderBottomWidth: active === t ? 2 : 0,
                }}
              >
                <Text style={{ fontWeight: active === t ? '700' : '500' }}>
                  {t}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <View style={{ borderTopWidth: 1, padding: 12 }}>
            {busy && <ActivityIndicator />}

            {active === 'documents' && <DocumentsTab dealId={dealId} />}

            {active === 'Follow up' && <FollowupsTab dealId={dealId} />}

            {active === 'People' && (
              <DealPeopleSection dealId={dealId} employees={employees} />
            )}

            {active === 'Notes' && <DealNotesSection dealId={dealId} />}

            {active === 'Comments' && <DealCommentsSection dealId={dealId} />}

            {active === 'Tags' && <DealTagsSection dealId={dealId} />}
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
