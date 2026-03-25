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
    setLocalDeals(Array.isArray(content) ? content : []);
  }, [dealsState]);

  const handleRowUpdate = useCallback((dealId, updates) => {
    setLocalDeals(prev =>
      prev.map(deal => (deal.id === dealId ? { ...deal, ...updates } : deal)),
    );
  }, []);

  const rows = localDeals;

  const filteredRows = useMemo(() => {
    return rows.filter(d => {
      // Enhanced search
      const searchLower = (filters.search || '').toLowerCase();
      if (
        filters.search &&
        ![
          d.title,
          d.leadName,
          d.leadCompany,
          d.leadEmail,
          d.leadMobile,
          d.value?.toString(),
          d.dealStage,
        ].some(field => field?.toLowerCase().includes(searchLower))
      ) {
        return false;
      }

      // Stage
      if (filters.stage && d.dealStage !== filters.stage) return false;

      // Agent
      if (filters.agent && d.dealAgent !== filters.agent) return false;

      // Min Value
      const minVal = parseFloat(filters.minValue || 0);
      if (filters.minValue && parseFloat(d.value || 0) < minVal) return false;

      // Watchers (comma separated)
      if (filters.watchers) {
        const watcherIds = filters.watchers
          .split(',')
          .map(w => w.trim())
          .filter(Boolean);
        if (
          watcherIds.length > 0 &&
          !watcherIds.some(wid => d.dealWatchers?.includes(wid))
        ) {
          return false;
        }
      }

      // Tags contains
      if (
        filters.tagSearch &&
        !d.tags?.some(t =>
          t.toLowerCase().includes(filters.tagSearch.toLowerCase()),
        )
      ) {
        return false;
      }

      // Priority
      if (filters.priorityId && d.priority?.id !== filters.priorityId)
        return false;

      // Pipeline
      if (filters.pipeline && d.pipeline !== filters.pipeline) return false;

      // Dates (expectedCloseDate)
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
