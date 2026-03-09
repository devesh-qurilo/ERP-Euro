import React, { useEffect, useMemo, useState } from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Pressable,
  FlatList,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';

import { selectEmpList } from '../../../hr/employees/store/selectors';
import { fetchEmployees } from '../../../hr/employees/store/actions';
import { selectAdminLeads } from '../../../leads/store/selectors';
import { fetchAdminLeads } from '../../store/actions';
import api from '../../../../../services/api';
import { selectKanbanStages } from '../kanban/store/selectors';
import { fetchKanban } from '../kanban/store/actions';

// export default function DealFormModal({ open, editing, onClose }) {
export default function DealFormModal({ open, editing, onClose, forceLeadId }) {
  const dispatch = useDispatch();
  const employees = useSelector(selectEmpList) || [];
  const leads = useSelector(selectAdminLeads) || [];

  const [showDate, setShowDate] = useState(false);
  const [leadDropdown, setLeadDropdown] = useState(false);
  const [agentDropdown, setAgentDropdown] = useState(false);
  const [watcherDropdown, setWatcherDropdown] = useState(false);
  const [categoryModal, setCategoryModal] = useState(false);

  const [leadSearch, setLeadSearch] = useState('');
  const [empSearch, setEmpSearch] = useState('');
  const [newCategoryName, setNewCategoryName] = useState('');
  const stages = useSelector(selectKanbanStages);

  const [categories, setCategories] = useState([]);

  const emptyForm = {
    title: '',
    leadId: forceLeadId || null,
    pipeline: 'Default Pipeline',
    dealStage: 'Generated',
    dealCategory: 'Corporate',
    dealAgent: '',
    dealWatchers: [],
    value: '',
    expectedCloseDate: null,
    dealContact: '',
  };

  const [form, setForm] = useState(emptyForm);

  useEffect(() => {
    dispatch(fetchEmployees());
    dispatch(fetchAdminLeads());
  }, []);

  useEffect(() => {
    if (editing) {
      setForm({
        ...editing,
        expectedCloseDate: editing.expectedCloseDate
          ? new Date(editing.expectedCloseDate)
          : null,
      });
    } else {
      setForm(emptyForm);
    }
  }, [editing, open]);

  useEffect(() => {
    if (open) {
      fetchCategories();
    }
  }, [open]);

  useEffect(() => {
    dispatch(fetchKanban());
  }, [dispatch]);

  const fetchCategories = async () => {
    try {
      const res = await api.get('/deals/dealCategory');
      setCategories(res.data || []);
    } catch (err) {
      // console.log('Category fetch error', err);
    }
  };

  const filteredLeads = useMemo(() => {
    return leads.filter(l =>
      l.name.toLowerCase().includes(leadSearch.toLowerCase()),
    );
  }, [leads, leadSearch]);

  const filteredEmployees = useMemo(() => {
    return employees.filter(e =>
      e.name.toLowerCase().includes(empSearch.toLowerCase()),
    );
  }, [employees, empSearch]);

  const handleSave = () => {
    const payload = {
      ...form,
      value: Number(form.value) || 0,
      expectedCloseDate: form.expectedCloseDate
        ? form.expectedCloseDate.toISOString().slice(0, 10)
        : null,
    };

    dispatch({
      type: editing?.id
        ? 'admin/deals/UPDATE_REQUEST'
        : 'admin/deals/CREATE_REQUEST',
      id: editing?.id,
      payload,
    });

    onClose?.();
  };

  const handleAddCategory = async () => {
    if (!newCategoryName) return;

    try {
      const res = await api.post('/deals/dealCategory', {
        categoryName: newCategoryName,
      });

      setCategories(prev => [
        ...prev,
        { id: res.data.id, name: newCategoryName },
      ]);

      setNewCategoryName('');
    } catch (err) {
      // console.log(err);
    }
    onClose?.();
  };

  const handleDeleteCategory = async id => {
    try {
      await api.delete(`/deals/dealCategory/${id}`);
      setCategories(prev => prev.filter(cat => cat.id !== id));
    } catch (err) {
      // console.log(err);
    }
  };

  if (!open) return null;

  return (
    <Modal transparent visible={open} animationType="fade">
      <Pressable style={styles.overlay} onPress={onClose}>
        <Pressable style={styles.card} onPress={() => {}}>
          <ScrollView keyboardShouldPersistTaps="handled">
            <Text style={styles.title}>
              {editing ? 'Edit Deal' : 'Add Deal'}
            </Text>

            <Text style={styles.label}>Title</Text>
            <TextInput
              style={styles.input}
              value={form.title}
              onChangeText={v => setForm({ ...form, title: v })}
            />

            <Text style={styles.label}>Lead</Text>
            <Pressable
              style={styles.dropdown}
              onPress={() => setLeadDropdown(true)}
            >
              <Text>
                {leads.find(l => l.id === form.leadId)?.name || 'Select Lead'}
              </Text>
            </Pressable>

            <Text style={styles.label}>Deal Contact</Text>
            <TextInput
              style={styles.input}
              value={form.dealContact}
              onChangeText={v => setForm({ ...form, dealContact: v })}
            />

            <Text style={styles.label}>Deal Agent</Text>
            <Pressable
              style={styles.dropdown}
              onPress={() => setAgentDropdown(true)}
            >
              <Text>
                {employees.find(e => e.employeeId === form.dealAgent)?.name ||
                  'Select Agent'}
              </Text>
            </Pressable>

            <Text style={styles.label}>Deal Watchers</Text>
            <Pressable
              style={styles.dropdown}
              onPress={() => setWatcherDropdown(true)}
            >
              <Text>
                {form.dealWatchers.length > 0
                  ? `${form.dealWatchers.length} Selected`
                  : 'Select Watchers'}
              </Text>
            </Pressable>

            <Text style={styles.label}>Value ($)</Text>
            <TextInput
              style={styles.input}
              keyboardType="numeric"
              value={String(form.value)}
              onChangeText={v => setForm({ ...form, value: v })}
            />

            <Text style={styles.label}>Pipeline</Text>
            <View style={styles.pickerBox}>
              <Picker
                selectedValue={form.pipeline}
                onValueChange={v => setForm({ ...form, pipeline: v })}
              >
                <Picker.Item
                  label="Default Pipeline"
                  value="Default Pipeline"
                />
                <Picker.Item label="Sales" value="Sales" />
                <Picker.Item label="Enterprise" value="Enterprise" />
              </Picker>
            </View>

            <Text style={styles.label}>Stage</Text>
            <View style={styles.pickerBox}>
              <Picker
                selectedValue={form.dealStage}
                onValueChange={v => setForm({ ...form, dealStage: v })}
              >
                {stages?.map(stage => (
                  <Picker.Item
                    key={stage.id}
                    label={stage.name}
                    value={stage.name}
                  />
                ))}
              </Picker>
            </View>

            <Text style={styles.label}>Expected Close Date</Text>
            <Pressable
              style={styles.dropdown}
              onPress={() => setShowDate(true)}
            >
              <Text>
                {form.expectedCloseDate
                  ? form.expectedCloseDate.toISOString().slice(0, 10)
                  : 'Select Date'}
              </Text>
            </Pressable>

            {showDate && (
              <DateTimePicker
                value={form.expectedCloseDate || new Date()}
                mode="date"
                onChange={(_, d) => {
                  setShowDate(false);
                  if (d) setForm({ ...form, expectedCloseDate: d });
                }}
              />
            )}

            <View style={styles.categoryRow}>
              <Text style={styles.label}>Category</Text>
              <Pressable onPress={() => setCategoryModal(true)}>
                <Text style={styles.addText}>+ Add</Text>
              </Pressable>
            </View>

            <View style={styles.pickerBox}>
              <Picker
                selectedValue={form.dealCategory}
                onValueChange={v => setForm({ ...form, dealCategory: v })}
              >
                {categories.map(cat => (
                  <Picker.Item
                    key={cat.id}
                    label={cat.categoryName}
                    value={cat.categoryName}
                  />
                ))}
              </Picker>
            </View>

            <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
              <Text style={styles.saveText}>
                {editing ? 'Update' : 'Create'}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.saveBtn,
                { backgroundColor: '#ccc', marginTop: 8 },
              ]}
              onPress={onClose}
            >
              <Text style={{ color: '#000', fontWeight: '700' }}>Cancel</Text>
            </TouchableOpacity>
          </ScrollView>
        </Pressable>
      </Pressable>

      {/* LEAD DROPDOWN */}
      {leadDropdown && (
        <Modal transparent animationType="fade">
          <Pressable
            style={styles.overlay}
            onPress={() => setLeadDropdown(false)}
          >
            <Pressable style={styles.dropdownCard}>
              <TextInput
                placeholder="Search Lead..."
                style={styles.input}
                value={leadSearch}
                onChangeText={setLeadSearch}
              />
              <FlatList
                data={filteredLeads}
                keyExtractor={item => item.id.toString()}
                renderItem={({ item }) => (
                  <Pressable
                    style={styles.dropdownRow}
                    onPress={() => {
                      setForm({ ...form, leadId: item.id });
                      setLeadDropdown(false);
                    }}
                  >
                    <Text>{item.name}</Text>
                  </Pressable>
                )}
              />
            </Pressable>
          </Pressable>
        </Modal>
      )}

      {/* AGENT DROPDOWN */}
      {agentDropdown && (
        <Modal transparent animationType="fade">
          <Pressable
            style={styles.overlay}
            onPress={() => setAgentDropdown(false)}
          >
            <Pressable style={styles.dropdownCard}>
              <TextInput
                placeholder="Search Agent..."
                style={styles.input}
                value={empSearch}
                onChangeText={setEmpSearch}
              />
              <FlatList
                data={filteredEmployees}
                keyExtractor={item => item.employeeId}
                renderItem={({ item }) => (
                  <Pressable
                    style={styles.dropdownRow}
                    onPress={() => {
                      setForm({ ...form, dealAgent: item.employeeId });
                      setAgentDropdown(false);
                    }}
                  >
                    <Text>{item.name}</Text>
                  </Pressable>
                )}
              />
            </Pressable>
          </Pressable>
        </Modal>
      )}

      {/* WATCHERS DROPDOWN */}
      {watcherDropdown && (
        <Modal transparent animationType="fade">
          <Pressable
            style={styles.overlay}
            onPress={() => setWatcherDropdown(false)}
          >
            <Pressable style={styles.dropdownCard}>
              <TextInput
                placeholder="Search..."
                style={styles.input}
                value={empSearch}
                onChangeText={setEmpSearch}
              />
              <FlatList
                data={filteredEmployees}
                keyExtractor={item => item.employeeId}
                renderItem={({ item }) => {
                  const selected = form.dealWatchers.includes(item.employeeId);
                  return (
                    <Pressable
                      style={styles.dropdownRow}
                      onPress={() => {
                        if (selected) {
                          setForm({
                            ...form,
                            dealWatchers: form.dealWatchers.filter(
                              id => id !== item.employeeId,
                            ),
                          });
                        } else {
                          setForm({
                            ...form,
                            dealWatchers: [
                              ...form.dealWatchers,
                              item.employeeId,
                            ],
                          });
                        }
                      }}
                    >
                      <Text>{item.name}</Text>
                      <Text>{selected ? '✓' : ''}</Text>
                    </Pressable>
                  );
                }}
              />
              <TouchableOpacity
                style={styles.saveBtn}
                onPress={() => setWatcherDropdown(false)}
              >
                <Text style={styles.saveText}>Done</Text>
              </TouchableOpacity>
            </Pressable>
          </Pressable>
        </Modal>
      )}

      {/* CATEGORY MODAL */}
      {categoryModal && (
        <Modal transparent animationType="fade">
          <Pressable
            style={styles.overlay}
            onPress={() => setCategoryModal(false)}
          >
            <Pressable style={styles.dropdownCard}>
              {categories.map(cat => (
                <View key={cat.id} style={styles.dropdownRow}>
                  <Text>{cat.categoryName}</Text>
                  <Pressable onPress={() => handleDeleteCategory(cat.id)}>
                    <Text style={{ color: 'red' }}>Delete</Text>
                  </Pressable>
                </View>
              ))}
              <TextInput
                placeholder="New Category"
                style={styles.input}
                value={newCategoryName}
                onChangeText={setNewCategoryName}
              />
              <TouchableOpacity
                style={styles.saveBtn}
                onPress={handleAddCategory}
              >
                <Text style={styles.saveText}>Add</Text>
              </TouchableOpacity>
            </Pressable>
          </Pressable>
        </Modal>
      )}
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    padding: 16,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    maxHeight: '90%',
  },
  dropdownCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    maxHeight: '80%',
  },
  title: { fontSize: 18, fontWeight: '800', marginBottom: 12 },
  label: { fontSize: 13, marginBottom: 4, color: '#555' },
  input: {
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 8,
    padding: 10,
    marginBottom: 12,
  },
  dropdown: {
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 8,
    padding: 10,
    marginBottom: 12,
  },
  pickerBox: {
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 8,
    marginBottom: 12,
  },
  dropdownRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderColor: '#f1f1f1',
  },
  categoryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  addText: {
    color: '#3F6AE1',
    fontWeight: '700',
    borderRadius: 8,
    borderWidth: 1,
    padding: 8,
  },
  saveBtn: {
    backgroundColor: '#3F6AE1',
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: 'center',
    marginTop: 10,
  },
  saveText: { color: '#fff', fontWeight: '700' },
});
