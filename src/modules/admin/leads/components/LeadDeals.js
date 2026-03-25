import React, { useEffect, useState } from 'react';
import {
  View,
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
} from 'react-native';
import { useDispatch } from 'react-redux';
import api from '../../../../services/api';
import DealTable from './DealTable';
import DealFormModal from '../../leads/deals/components/DealFormModal';
import AddFollowupModal from '../../leads/deals/components/AddFollowupModal';

import { setEditing, setFormOpen } from '../../leads/deals/store/actions';

export default function LeadDeals({ leadId }) {
  const dispatch = useDispatch();

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  const [formOpen, setFormOpenLocal] = useState(false);
  const [editingDeal, setEditingDeal] = useState(null);

  const [followupOpen, setFollowupOpen] = useState(false);
  const [selectedDealId, setSelectedDealId] = useState(null);

  /* ================= FETCH DEALS ================= */

  const fetchDeals = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/deals/lead/${leadId}`);
      setData(res.data || []);
    } catch (err) {
      console.log('Lead deals error', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (leadId) fetchDeals();
  }, [leadId]);

  /* ================= ADD DEAL ================= */

  const handleAddDeal = () => {
    setEditingDeal(null);
    setFormOpenLocal(true);
    fetchDeals();
  };

  /* ================= EDIT DEAL ================= */

  const handleEditDeal = deal => {
    setEditingDeal(deal);
    setFormOpenLocal(true);
    fetchDeals();
  };

  /* ================= FOLLOWUP ================= */

  const handleAddFollowup = dealId => {
    setSelectedDealId(dealId);
    setFollowupOpen(true);
    fetchDeals();
  };

  const handleRowUpdate = (dealId, updatedFields) => {
    setData(prev =>
      prev.map(d => (d.id === dealId ? { ...d, ...updatedFields } : d)),
    );
  };

  const handleDeleteDeal = async deal => {
    try {
      await api.delete(`/deals/${deal.id}`);
      fetchDeals(); // 🔥 refetch after delete
    } catch (err) {
      console.log(err);
    }
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator />
      </View>
    );
  }

  return (
    <View>
      {/* ===== ADD BUTTON ===== */}
      <View style={styles.headerRow}>
        <Text style={styles.title}>Deals</Text>

        <TouchableOpacity style={styles.addBtn} onPress={handleAddDeal}>
          <Text style={styles.addText}>+ Add Deal</Text>
        </TouchableOpacity>
      </View>

      {/* ===== TABLE ===== */}
      <DealTable
        data={data}
        loading={loading}
        busyIds={{}}
        onAddFollowup={handleAddFollowup}
        onEdit={handleEditDeal}
        onDelete={handleDeleteDeal}
        onRowUpdate={handleRowUpdate}
      />

      {/* ===== DEAL FORM ===== */}
      <DealFormModal
        open={formOpen}
        editing={editingDeal}
        onClose={() => {
          setFormOpenLocal(false);
          fetchDeals(); // 🔥 refresh
        }}
        forceLeadId={leadId} // 🔥 important
      />

      {/* ===== FOLLOWUP ===== */}
      <AddFollowupModal
        visible={followupOpen}
        onClose={() => {
          setFollowupOpen(false);
          setSelectedDealId(null);
        }}
        onSave={async payload => {
          await api.post(`/deals/${selectedDealId}/followup`, payload);
          setFollowupOpen(false);
          fetchDeals();
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  center: {
    paddingVertical: 20,
    alignItems: 'center',
  },

  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },

  title: {
    fontSize: 16,
    fontWeight: '700',
  },

  addBtn: {
    backgroundColor: '#3F6AE1',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },

  addText: {
    color: '#fff',
    fontWeight: '600',
  },
});
