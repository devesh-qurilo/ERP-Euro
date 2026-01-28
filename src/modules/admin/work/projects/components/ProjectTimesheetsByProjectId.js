import React, { useEffect, useState } from 'react';
import { View, Pressable, Text, ActivityIndicator } from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import { useDispatch } from 'react-redux';

import TimesheetsTable from '../../timesheets/components/TimesheetsTable';
import AddTimeLogModal from '../components/AddTimeLogModal';
import { createTimesheet } from '../../timesheets/store/actions';
import TimesheetViewModal from '../components/TimesheetViewModal';

import api from '../../../../../services/api';

export default function ProjectTimesheetsByProjectId({
  projectId,
  projectMembers = [],
}) {
  const dispatch = useDispatch();

  const [busy, setBusy] = useState(false);
  const [rows, setRows] = useState([]);

  const [addOpen, setAddOpen] = useState(false);
  const [active, setActive] = useState(null); // edit data
  const [creating, setCreating] = useState(false);

  const [viewOpen, setViewOpen] = useState(false);
  const [viewRow, setViewRow] = useState(null);

  const load = async () => {
    if (!projectId) return;
    setBusy(true);
    try {
      const res = await api.get(`/timesheets/project/${projectId}`);
      setRows(res.data || []);
    } finally {
      setBusy(false);
    }
  };

  useEffect(() => {
    load();
  }, [projectId]);

  return (
    <View style={{ marginTop: 14 }}>
      {/* ADD BUTTON */}
      <Pressable
        // onPress={() => {
        //   setActive({
        //     projectId, // 🔥 PREFILL PROJECT
        //   });
        //   setAddOpen(true);
        // }}

        onPress={() => {
          setActive(null); // 🔥 ADD MODE
          setAddOpen(true);
        }}
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          alignSelf: 'flex-end',
          marginBottom: 10,
          paddingVertical: 8,
          paddingHorizontal: 14,
          borderRadius: 8,
          backgroundColor: '#1946b9',
        }}
      >
        <Feather name="plus" size={18} color="#fff" />
        <Text style={{ color: '#fff', marginLeft: 6, fontWeight: '700' }}>
          Add Timesheet
        </Text>
      </Pressable>

      {busy ? (
        <ActivityIndicator />
      ) : (
        <TimesheetsTable
          data={rows}
          onEdit={row => {
            setActive(row);
            setAddOpen(true);
          }}
          onView={row => {
            setViewRow(row);
            setViewOpen(true);
          }}
          onDelete={async row => {
            await api.delete(`/timesheets/${row.id}`);
            load();
          }}
        />
      )}

      {/* ✅ REUSE EXISTING MODAL */}
      {/* <AddTimeLogModal
        visible={addOpen}
        editData={active}
        saving={creating}
        projectMembers={projectMembers}
        onClose={() => {
          setAddOpen(false);
          setActive(null);
        }}
        onSubmit={payload => dispatch(createTimesheet(payload))}
      /> */}

      <AddTimeLogModal
        visible={addOpen}
        editData={active} // null = ADD, object = EDIT
        fixedProjectId={projectId} // 👈 project context lives here
        projectMembers={projectMembers}
        saving={creating}
        onClose={() => {
          setAddOpen(false);
          setActive(null);
        }}
        onSubmit={payload => dispatch(createTimesheet(payload))}
      />
      <TimesheetViewModal
        visible={viewOpen}
        data={viewRow}
        onClose={() => {
          setViewOpen(false);
          setViewRow(null);
        }}
      />
    </View>
  );
}
