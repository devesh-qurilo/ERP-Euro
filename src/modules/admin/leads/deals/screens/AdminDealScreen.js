// screens/AdminDealScreen.js
import React, { useEffect, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import AddFollowupModal from '../components/AddFollowupModal';

import {
  fetchList,
  setParams,
  setFormOpen,
  setEditing,
} from '../../deals/store/actions';

import {
  selectDeals,
  selectDealsBusy,
  selectDealsParams,
  selectFormOpen,
  selectEditing,
} from '../../deals/store/selectors';

import DealFilters from '../components/DealFilters';
import DealActionsBar from '../components/DealActionsBar';
import DealTable from '../components/DealTable';
import DealFormModal from '../components/DealFormModal';

// 👇 IMPORT THIS
import { addFollowup } from '../../deals/view/store/actions';

export default function AdminDealScreen() {
  const dispatch = useDispatch();

  const dealsState = useSelector(selectDeals);
  const busy = useSelector(selectDealsBusy);
  const params = useSelector(selectDealsParams);
  const formOpen = useSelector(selectFormOpen);
  const editing = useSelector(selectEditing);

  // 👇 FOLLOWUP CONTROL
  const [followupOpen, setFollowupOpen] = useState(false);
  const [selectedDealId, setSelectedDealId] = useState(null);

  useEffect(() => {
    dispatch(fetchList());
  }, []);

  const rows = Array.isArray(dealsState?.content)
    ? dealsState.content
    : dealsState || [];

  return (
    <View style={styles.screen}>
      <DealFilters
        defaultParams={params}
        onApply={p => {
          dispatch(setParams(p));
          dispatch(fetchList(p));
        }}
      />

      <DealActionsBar
        onAdd={() => {
          dispatch(setEditing(null));
          dispatch(setFormOpen(true));
        }}
      />

      <DealTable
        data={rows}
        loading={busy}
        onAddFollowup={dealId => {
          setSelectedDealId(dealId);
          setFollowupOpen(true);
        }}
      />

      <DealFormModal open={formOpen} editing={editing} />

      {/* 🔥 Clean Followup Modal */}
      <AddFollowupModal
        visible={followupOpen}
        onClose={() => {
          setFollowupOpen(false);
          setSelectedDealId(null);
        }}
        onSave={payload => {
          dispatch(addFollowup(selectedDealId, payload));
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#F6F7FB' },
});
