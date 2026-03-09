import React, { useEffect, useState, useMemo } from 'react';
import { View, StyleSheet } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';

import AddFollowupModal from '../components/AddFollowupModal';
import DealFilters from '../components/DealFilters';
import DealActionsBar from '../components/DealActionsBar';
import DealTable from '../components/DealTable';
import DealFormModal from '../components/DealFormModal';

import { fetchList, setFormOpen, setEditing } from '../../deals/store/actions';

import {
  selectDeals,
  selectDealsBusy,
  selectFormOpen,
  selectEditing,
} from '../../deals/store/selectors';

import { addFollowup } from '../../deals/view/store/actions';
import { fetchPriorities } from '../priorities/actions';

export default function AdminDealScreen() {
  const dispatch = useDispatch();

  const dealsState = useSelector(selectDeals);
  const busy = useSelector(selectDealsBusy);
  const formOpen = useSelector(selectFormOpen);
  const editing = useSelector(selectEditing);

  const [followupOpen, setFollowupOpen] = useState(false);
  const [selectedDealId, setSelectedDealId] = useState(null);
  const [filters, setFilters] = useState({});

  useEffect(() => {
    dispatch(fetchList()); // fetch once
    dispatch(fetchPriorities());
  }, []);

  const rows = Array.isArray(dealsState?.content)
    ? dealsState.content
    : dealsState || [];

  const filteredRows = useMemo(() => {
    return rows.filter(d => {
      if (
        filters.search &&
        !d.title?.toLowerCase().includes(filters.search.toLowerCase()) &&
        !d.leadName?.toLowerCase().includes(filters.search.toLowerCase())
      )
        return false;

      if (filters.stage && d.dealStage !== filters.stage) return false;

      if (filters.agent && d.dealAgent !== filters.agent) return false;

      if (
        filters.dateFrom &&
        new Date(d.expectedCloseDate) < new Date(filters.dateFrom)
      )
        return false;

      if (
        filters.dateTo &&
        new Date(d.expectedCloseDate) > new Date(filters.dateTo)
      )
        return false;

      return true;
    });
  }, [rows, filters]);

  return (
    <View style={styles.screen}>
      {/* 🔹 FIXED FILTER */}
      <View style={styles.headerSection}>
        <DealFilters onChange={f => setFilters(f)} />

        <DealActionsBar
          onAdd={() => {
            dispatch(setEditing(null));
            dispatch(setFormOpen(true));
          }}
        />
      </View>

      {/* 🔹 SCROLLABLE TABLE AREA */}
      <View style={styles.tableSection}>
        <DealTable
          data={filteredRows}
          loading={busy}
          onAddFollowup={dealId => {
            setSelectedDealId(dealId);
            setFollowupOpen(true);
          }}
        />
      </View>

      {/* 🔹 MODALS */}
      <DealFormModal
        open={formOpen}
        editing={editing}
        onClose={() => dispatch(setFormOpen(false))}
      />

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
  screen: {
    flex: 1,
    backgroundColor: '#F6F7FB',
  },

  headerSection: {
    backgroundColor: '#F6F7FB',
    zIndex: 10,
  },

  tableSection: {
    flex: 1, // 👈 IMPORTANT
  },
});
