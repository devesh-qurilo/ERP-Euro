import React, { useEffect, useMemo, useState } from 'react';
import {
  View,
  Text,
  Pressable,
  FlatList,
  ScrollView,
  Alert,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import Feather from 'react-native-vector-icons/Feather';

import api from '../../../../../services/api';
import { fetchEmployees } from '../../../hr/employees/store/actions';
import { selectEmpList } from '../../../hr/employees/store/selectors';
import BottomSheetSelect from '../../timesheets/components/BottomSheetSelect';

export default function ProjectMembersPanel({ projectId }) {
  const dispatch = useDispatch();
  const employees = useSelector(selectEmpList);

  const [members, setMembers] = useState([]);
  const [adminId, setAdminId] = useState(null);

  const [addOpen, setAddOpen] = useState(false);

  /* ---------------- LOAD PROJECT ---------------- */

  const loadProject = async () => {
    if (!projectId) return;

    const res = await api.get(`/projects/${projectId}`);
    setMembers(res.data.assignedEmployees || []);
    setAdminId(res.data.projectAdminId || null);
  };

  useEffect(() => {
    dispatch(fetchEmployees());
    loadProject();
  }, [projectId]);

  /* ---------------- OPTIONS ---------------- */

  const availableEmpOpts = useMemo(() => {
    const assignedIds = new Set(members.map(m => m.employeeId));

    return employees
      .filter(e => !assignedIds.has(e.employeeId))
      .map(e => ({
        label: `${e.name} (${e.employeeId})`,
        value: e.employeeId,
      }));
  }, [employees, members]);

  /* ---------------- MEMBER ACTIONS ---------------- */

  const assignEmployee = async employeeId => {
    try {
      await api.post(`/api/projects/${projectId}/assign`, {
        employeeIds: [employeeId],
      });

      setAddOpen(false);
      loadProject();
    } catch (e) {
      Alert.alert(
        'Error',
        e?.response?.data?.message || 'Failed to assign member',
      );
    }
  };

  const removeEmployee = employeeId => {
    Alert.alert(
      'Remove Member',
      'Are you sure you want to remove this member?',
      [
        { text: 'Cancel' },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: async () => {
            try {
              await api.delete(
                `/api/projects/${projectId}/assign/${employeeId}`,
              );
              loadProject();
            } catch (e) {
              Alert.alert(
                'Error',
                e?.response?.data?.message || 'Failed to remove member',
              );
            }
          },
        },
      ],
    );
  };

  /* ---------------- ADMIN LOGIC ---------------- */

  const assignAdmin = async employeeId => {
    try {
      await api.post(`/projects/${projectId}/admin`, null, {
        params: { userId: employeeId },
      });
      loadProject();
    } catch (err) {
      const msg = err?.response?.data?.message || 'Failed to assign admin';

      if (msg.includes('already has an admin')) {
        Alert.alert('Admin exists', msg, [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Remove & Assign',
            style: 'destructive',
            onPress: async () => {
              try {
                await api.delete(`/projects/${projectId}/admin`);
                await api.post(`/projects/${projectId}/admin`, null, {
                  params: { userId: employeeId },
                });
                loadProject();
              } catch (e) {
                Alert.alert(
                  'Error',
                  e?.response?.data?.message || 'Failed to change admin',
                );
              }
            },
          },
        ]);
      } else {
        Alert.alert('Error', msg);
      }
    }
  };

  const removeAdmin = () => {
    Alert.alert(
      'Remove Admin',
      'Are you sure you want to remove project admin?',
      [
        { text: 'Cancel' },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: async () => {
            await api.delete(`/projects/${projectId}/admin`);
            loadProject();
          },
        },
      ],
    );
  };

  /* ---------------- RENDER ---------------- */

  return (
    <View style={{ marginTop: 16 }}>
      {/* HEADER */}
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          marginBottom: 10,
        }}
      >
        <Text style={{ fontSize: 16, fontWeight: '900' }}>Project Members</Text>

        <Pressable onPress={() => setAddOpen(true)}>
          <Feather name="plus" size={22} color="#2563eb" />
        </Pressable>
      </View>

      {/* HORIZONTAL TABLE */}
      <ScrollView horizontal>
        <View style={{ minWidth: 700 }}>
          {/* TABLE HEAD */}
          <View
            style={{
              flexDirection: 'row',
              backgroundColor: '#e8f0ff',
              paddingVertical: 10,
            }}
          >
            <Cell w={200} bold text="Employee" />
            <Cell w={180} bold text="Designation" />
            <Cell w={140} bold text="Admin" />
            <Cell w={120} bold text="Action" />
          </View>

          {/* ROWS */}
          <FlatList
            data={members}
            keyExtractor={m => m.employeeId}
            renderItem={({ item }) => {
              const isAdmin = adminId === item.employeeId;

              return (
                <View
                  style={{
                    flexDirection: 'row',
                    borderBottomWidth: 1,
                    borderColor: '#e5e7eb',
                    paddingVertical: 12,
                  }}
                >
                  <Cell w={200} text={item.name} />
                  <Cell w={180} text={item.designation || '—'} />

                  <Cell w={140}>
                    <Pressable
                      onPress={() => assignAdmin(item.employeeId)}
                      style={{ flexDirection: 'row', alignItems: 'center' }}
                    >
                      <View
                        style={{
                          width: 14,
                          height: 14,
                          borderRadius: 7,
                          borderWidth: 1,
                          borderColor: '#2563eb',
                          backgroundColor: isAdmin ? '#2563eb' : '#fff',
                          marginRight: 8,
                        }}
                      />
                      <Text>{isAdmin ? 'Admin' : 'Make Admin'}</Text>
                    </Pressable>

                    {isAdmin && (
                      <Pressable onPress={removeAdmin}>
                        <Text
                          style={{
                            color: '#ef4444',
                            marginTop: 6,
                            fontWeight: '700',
                          }}
                        >
                          Remove Admin
                        </Text>
                      </Pressable>
                    )}
                  </Cell>

                  <Cell w={120}>
                    <Pressable onPress={() => removeEmployee(item.employeeId)}>
                      <Feather name="trash" size={18} color="#ef4444" />
                    </Pressable>
                  </Cell>
                </View>
              );
            }}
          />
        </View>
      </ScrollView>

      {/* ASSIGN EMPLOYEE SHEET */}
      <BottomSheetSelect
        visible={addOpen}
        title="Assign Employee"
        options={availableEmpOpts}
        onSelect={o => assignEmployee(o.value)} // 🔥 FIXED
        onClose={() => setAddOpen(false)}
      />
    </View>
  );
}

/* ---------------- CELL ---------------- */

function Cell({ w, text, bold, children }) {
  return (
    <View style={{ width: w, paddingHorizontal: 12 }}>
      {children || (
        <Text style={{ fontWeight: bold ? '900' : '600' }}>{text}</Text>
      )}
    </View>
  );
}
