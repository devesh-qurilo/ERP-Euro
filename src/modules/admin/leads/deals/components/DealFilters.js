import React, { useEffect, useMemo, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  StyleSheet,
  Pressable,
} from 'react-native';
import { fetchPriorities } from '../priorities/actions';
import { selectPriorities } from '../priorities/selectors';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useDispatch, useSelector } from 'react-redux';
import { selectEmpList } from '../../../hr/employees/store/selectors';
import { fetchEmployees } from '../../../hr/employees/store/actions';
import SelectModal from './SelectModal';

export default function DealFilters({ onChange }) {
  const employees = useSelector(selectEmpList) || [];
  const dispatch = useDispatch();

  const [search, setSearch] = useState('');
  const [stage, setStage] = useState('');
  const [agent, setAgent] = useState('');
  const [dateFrom, setDateFrom] = useState(null);
  const [dateTo, setDateTo] = useState(null);
  const [minValue, setMinValue] = useState('');
  const [watchers, setWatchers] = useState('');
  const [tagSearch, setTagSearch] = useState('');
  const [priorityId, setPriorityId] = useState('');
  const [pipeline, setPipeline] = useState('');

  const [showStage, setShowStage] = useState(false);
  const [showAgent, setShowAgent] = useState(false);
  const [showFromPicker, setShowFromPicker] = useState(false);
  const [showToPicker, setShowToPicker] = useState(false);
  const [showPriority, setShowPriority] = useState(false);
  const [showPipeline, setShowPipeline] = useState(false);
  const [showWatchers, setShowWatchers] = useState(false);

  const stageOptions = [
    { label: 'All Stages', value: '' },
    { label: 'Generated', value: 'Generated' },
    { label: 'Schedule Appoinment', value: 'Schedule Appoinment' },
    { label: 'Won', value: 'Won' },
    { label: 'Lost', value: 'Lost' },
  ];

  const pipelineOptions = [
    { label: 'All Pipelines', value: '' },
    { label: 'Sales', value: 'Sales' },
    { label: 'Default Pipeline', value: 'Default Pipeline' },
  ];

  const priorities = useSelector(selectPriorities) || [];
  const priorityOptions = [
    { label: 'All Priorities', value: '' },
    ...priorities.map(p => ({
      label: p.status || `Priority ${p.id}`,
      value: p.id,
    })),
  ];

  const handleClear = () => {
    setSearch('');
    setStage('');
    setAgent('');
    setDateFrom(null);
    setDateTo(null);

    onChange({}); // reset filters in parent
  };

  const agentOptions = useMemo(
    () =>
      [{ label: 'All Agents', value: '' }].concat(
        employees.map(e => ({
          label: `${e.name} (${e.employeeId})`,
          value: e.employeeId,
        })),
      ),
    [employees],
  );

  /* 🔥 Instant filtering */
  useEffect(() => {
    onChange({
      search,
      stage,
      agent,
      dateFrom,
      dateTo,
      minValue,
      watchers,
      tagSearch,
      priorityId,
      pipeline,
    });
  }, [
    search,
    stage,
    agent,
    dateFrom,
    dateTo,
    minValue,
    watchers,
    tagSearch,
    priorityId,
    pipeline,
  ]);

  useEffect(() => {
    dispatch(fetchEmployees());
    dispatch(fetchPriorities());
  }, [dispatch]);

  return (
    <>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.container}
      >
        <Pressable style={styles.clearBtn} onPress={handleClear}>
          <Text style={styles.clearText}>Clear</Text>
        </Pressable>
        {/* Search */}
        <TextInput
          placeholder="Search (title/lead/...)"
          style={styles.input}
          value={search}
          onChangeText={setSearch}
        />
        <TextInput
          placeholder="Min Value"
          style={styles.input}
          value={minValue}
          onChangeText={setMinValue}
          keyboardType="numeric"
        />
        {/* Stage */}
        <Pressable style={styles.dropdown} onPress={() => setShowStage(true)}>
          <Text>{stage || 'Stage'}</Text>
        </Pressable>
        {/* Agent */}
        <Pressable style={styles.dropdown} onPress={() => setShowAgent(true)}>
          <Text>
            {agent
              ? employees.find(e => e.employeeId === agent)?.name || agent
              : 'Agent'}
          </Text>
        </Pressable>
        <TextInput
          placeholder="Watchers (EMP-1004,EMP-1005)"
          style={styles.input}
          value={watchers}
          onChangeText={setWatchers}
        />
        <TextInput
          placeholder="Tags contains"
          style={styles.input}
          value={tagSearch}
          onChangeText={setTagSearch}
        />
        {/* Priority */}
        <Pressable
          style={styles.dropdown}
          onPress={() => setShowPriority(true)}
        >
          <Text>{priorityId || 'Priority'}</Text>
        </Pressable>
        {/* Pipeline */}
        <Pressable
          style={styles.dropdown}
          onPress={() => setShowPipeline(true)}
        >
          <Text>{pipeline || 'Pipeline'}</Text>
        </Pressable>
        {/* Date From */}
        <Pressable
          style={styles.dropdown}
          onPress={() => setShowFromPicker(true)}
        >
          <Text>
            {dateFrom ? dateFrom.toISOString().slice(0, 10) : 'From Date'}
          </Text>
        </Pressable>

        {/* Date To */}
        <Pressable
          style={styles.dropdown}
          onPress={() => setShowToPicker(true)}
        >
          <Text>{dateTo ? dateTo.toISOString().slice(0, 10) : 'To Date'}</Text>
        </Pressable>
      </ScrollView>

      {/* Dropdown Modals */}
      <SelectModal
        visible={showStage}
        options={stageOptions}
        onSelect={setStage}
        onClose={() => setShowStage(false)}
      />

      <SelectModal
        visible={showAgent}
        options={agentOptions}
        onSelect={setAgent}
        onClose={() => setShowAgent(false)}
      />

      {/* New Modals */}
      <SelectModal
        visible={showPriority}
        options={priorityOptions}
        onSelect={setPriorityId}
        onClose={() => setShowPriority(false)}
      />
      <SelectModal
        visible={showPipeline}
        options={pipelineOptions}
        onSelect={setPipeline}
        onClose={() => setShowPipeline(false)}
      />
      {/* Watchers multi not modal - textinput comma */}

      {/* Date Pickers */}
      {showFromPicker && (
        <DateTimePicker
          value={dateFrom || new Date()}
          mode="date"
          display="default"
          onChange={(_, selected) => {
            setShowFromPicker(false);
            if (selected) setDateFrom(selected);
          }}
        />
      )}

      {showToPicker && (
        <DateTimePicker
          value={dateTo || new Date()}
          mode="date"
          display="default"
          onChange={(_, selected) => {
            setShowToPicker(false);
            if (selected) setDateTo(selected);
          }}
        />
      )}
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    alignItems: 'flex-start',
    gap: 10,
    // backgroundColor: '#d84242',
  },

  input: {
    width: 160,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 8,
    padding: 10,
    backgroundColor: '#fff',
  },

  dropdown: {
    minWidth: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    paddingHorizontal: 12,
    borderRadius: 8,
    padding: 10,
    backgroundColor: '#fff',
  },
  clearBtn: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ef4444',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 8,
  },

  clearText: {
    color: '#ef4444',
    fontWeight: '600',
  },
});
