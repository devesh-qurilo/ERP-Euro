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
import { useCallback } from 'react';
import DealExportButton from '../components/DealExportButton';
import DealImportButton from '../components/DealImportButton';

export default function AdminDealScreen() {
  const dispatch = useDispatch();

  const dealsState = useSelector(selectDeals);
  const busy = useSelector(selectDealsBusy);
  const formOpen = useSelector(selectFormOpen);
  const editing = useSelector(selectEditing);

  const [followupOpen, setFollowupOpen] = useState(false);
  const [selectedDealId, setSelectedDealId] = useState(null);
  const [filters, setFilters] = useState({});
  const [localDeals, setLocalDeals] = useState([]);

  // Initial fetch
  useEffect(() => {
    dispatch(fetchList());
    dispatch(fetchPriorities());
  }, []);

  // Sync local from Redux always
  useEffect(() => {
    const content = dealsState?.content || dealsState || [];
    console.log('Sync deals:', content.length);
    setLocalDeals(Array.isArray(content) ? content : []);
  }, [dealsState]);

  const handleRowUpdate = useCallback((dealId, updates) => {
    setLocalDeals(prev =>
      prev.map(deal => (deal.id === dealId ? { ...deal, ...updates } : deal)),
    );
  }, []);

  const rows = localDeals;
  console.log(
    'rows length:',
    rows.length,
    'localDeals:',
    localDeals.length,
    'dealsState:',
    dealsState?.content?.length,
  );

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

        {/* <DealActionsBar
          onAdd={() => {
            dispatch(setEditing(null));
            dispatch(setFormOpen(true));
          }}
        /> */}
      </View>
      <View style={styles.actionsRow}>
        <DealActionsBar
          onAdd={() => {
            dispatch(setEditing(null));
            dispatch(setFormOpen(true));
          }}
        />

        <View style={styles.importExportRow}>
          <DealImportButton
            onImported={() => {
              dispatch(fetchList());
            }}
          />

          <DealExportButton deals={filteredRows} />
        </View>
      </View>

      {/* 🔹 SCROLLABLE TABLE AREA */}
      <View style={styles.tableSection}>
        <DealTable
          data={filteredRows}
          loading={busy}
          onRowUpdate={handleRowUpdate}
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
  actionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingBottom: 8,
  },

  importExportRow: {
    flexDirection: 'row',
    gap: 10,
  },
});
