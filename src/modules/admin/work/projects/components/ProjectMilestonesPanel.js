// import React, { useEffect, useState } from 'react';
// import {
//   View,
//   Text,
//   Pressable,
//   FlatList,
//   ScrollView,
//   Alert,
// } from 'react-native';
// import Feather from 'react-native-vector-icons/Feather';

// import api from '../../../../../services/api';
// import MilestoneModal from '../components/MilestoneModal';

// const COLS = {
//   title: 220,
//   cost: 140,
//   status: 160,
//   start: 140,
//   end: 140,
//   action: 120,
// };

// const TABLE_WIDTH =
//   COLS.title + COLS.cost + COLS.status + COLS.start + COLS.end + COLS.action;

// export default function ProjectMilestonesPanel({ projectId }) {
//   const [rows, setRows] = useState([]);
//   const [open, setOpen] = useState(false);
//   const [active, setActive] = useState(null);

//   /* ---------------- LOAD ---------------- */

//   const load = async () => {
//     if (!projectId) return;
//     const res = await api.get(`/projects/${projectId}/milestones`);
//     setRows(res.data || []);
//   };

//   useEffect(() => {
//     load();
//   }, [projectId]);

//   /* ---------------- ACTIONS ---------------- */

//   const remove = id =>
//     Alert.alert('Delete milestone?', '', [
//       { text: 'Cancel' },
//       {
//         text: 'Delete',
//         style: 'destructive',
//         onPress: async () => {
//           await api.delete(`/api/projects/${projectId}/milestones/${id}`);
//           load();
//         },
//       },
//     ]);

//   const toggleStatus = async m => {
//     await api.patch(`/api/projects/${projectId}/milestones/${m.id}/status`, {
//       status: m.status === 'COMPLETED' ? 'INCOMPLETE' : 'COMPLETED',
//     });
//     load();
//   };

//   /* ---------------- RENDER ---------------- */

//   return (
//     <View style={{ marginTop: 16 }}>
//       {/* HEADER BAR */}
//       <View
//         style={{
//           flexDirection: 'row',
//           justifyContent: 'space-between',
//           marginBottom: 8,
//         }}
//       >
//         <Text style={{ fontSize: 16, fontWeight: '900' }}>
//           Project Milestones
//         </Text>

//         <Pressable
//           onPress={() => {
//             setActive(null);
//             setOpen(true);
//           }}
//         >
//           <Feather name="plus" size={22} color="#2563eb" />
//         </Pressable>
//       </View>

//       {/* 🔥 ONE HORIZONTAL SCROLL FOR HEADER + TABLE */}
//       <ScrollView horizontal showsHorizontalScrollIndicator={false}>
//         <View style={{ minWidth: TABLE_WIDTH }}>
//           {/* TABLE HEADER */}
//           <View
//             style={{
//               flexDirection: 'row',
//               backgroundColor: '#eef2ff',
//               paddingVertical: 10,
//               borderBottomWidth: 1,
//               borderColor: '#c7d2fe',
//             }}
//           >
//             <Cell w={COLS.title} bold text="Title" />
//             <Cell w={COLS.cost} bold text="Cost" />
//             <Cell w={COLS.status} bold text="Status" />
//             <Cell w={COLS.start} bold text="Start Date" />
//             <Cell w={COLS.end} bold text="End Date" />
//             <Cell w={COLS.action} bold text="Action" />
//           </View>

//           {/* TABLE BODY (VERTICAL ONLY) */}
//           <FlatList
//             data={rows}
//             keyExtractor={i => String(i.id)}
//             renderItem={({ item }) => (
//               <View
//                 style={{
//                   flexDirection: 'row',
//                   paddingVertical: 12,
//                   borderBottomWidth: 1,
//                   borderColor: '#e5e7eb',
//                 }}
//               >
//                 <Cell w={COLS.title} text={item.title} />
//                 <Cell w={COLS.cost} text={`$${item.milestoneCost}`} />

//                 <Cell w={COLS.status}>
//                   <Pressable onPress={() => toggleStatus(item)}>
//                     <Text
//                       style={{
//                         fontWeight: '900',
//                         color:
//                           item.status === 'COMPLETED' ? '#16a34a' : '#f59e0b',
//                       }}
//                     >
//                       {item.status}
//                     </Text>
//                   </Pressable>
//                 </Cell>

//                 <Cell w={COLS.start} text={item.startDate} />
//                 <Cell w={COLS.end} text={item.endDate} />

//                 <Cell w={COLS.action}>
//                   <View style={{ flexDirection: 'row', gap: 14 }}>
//                     <Pressable
//                       onPress={() => {
//                         setActive(item);
//                         setOpen(true);
//                       }}
//                     >
//                       <Feather name="edit" size={18} />
//                     </Pressable>

//                     <Pressable onPress={() => remove(item.id)}>
//                       <Feather name="trash" size={18} color="#ef4444" />
//                     </Pressable>
//                   </View>
//                 </Cell>
//               </View>
//             )}
//           />
//         </View>
//       </ScrollView>

//       {/* MODAL */}
//       <MilestoneModal
//         visible={open}
//         projectId={projectId}
//         editData={active}
//         onClose={() => {
//           setOpen(false);
//           setActive(null);
//         }}
//         onSuccess={load}
//       />
//     </View>
//   );
// }

// /* ---------------- CELL ---------------- */

// const Cell = ({ w, text, bold, children }) => (
//   <View style={{ width: w, paddingHorizontal: 12 }}>
//     {children || (
//       <Text style={{ fontWeight: bold ? '900' : '600' }}>{text}</Text>
//     )}
//   </View>
// );

import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Pressable,
  FlatList,
  ScrollView,
  Modal,
  TextInput,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import DateTimePicker from '@react-native-community/datetimepicker';

import api from '../../../../../services/api';

/* ---------------------------------- MAIN ---------------------------------- */

export default function ProjectMilestonesPanel({ projectId }) {
  const [rows, setRows] = useState([]);
  const [busy, setBusy] = useState(false);

  const [modalOpen, setModalOpen] = useState(false);
  const [editData, setEditData] = useState(null);

  const [statusOpen, setStatusOpen] = useState(false);
  const [activeStatusRow, setActiveStatusRow] = useState(null);

  /* ---------------------------- LOAD MILESTONES ---------------------------- */

  const load = async () => {
    if (!projectId) return;
    setBusy(true);
    try {
      const res = await api.get(`/api/projects/${projectId}/milestones`);
      setRows(res.data || []);
    } finally {
      setBusy(false);
    }
  };

  const STATUS_OPTIONS = [
    { label: 'INCOMPLETE', value: 'INCOMPLETE' },
    { label: 'COMPLETED', value: 'COMPLETED' },
  ];

  useEffect(() => {
    load();
  }, [projectId]);

  /* ---------------------------- STATUS UPDATE ---------------------------- */

  const updateStatus = async (milestoneId, status) => {
    const fd = new FormData();
    fd.append('status', status);

    console.log('milestoneId, status', milestoneId, status);

    try {
      await api.patch(
        `/api/projects/${projectId}/milestones/${milestoneId}/status`,
        fd,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        },
      );

      load();
    } catch (e) {
      console.log(e);
      Alert.alert('Error', 'Failed to update status');
    }
  };

  /* ---------------------------- DELETE ---------------------------- */

  const removeMilestone = milestoneId => {
    Alert.alert('Delete Milestone', 'Are you sure?', [
      { text: 'Cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          await api.delete(
            `/api/projects/${projectId}/milestones/${milestoneId}`,
          );
          load();
        },
      },
    ]);
  };

  /* ---------------------------- TABLE CELL ---------------------------- */

  const Cell = ({ width = 140, children }) => (
    <View style={{ width, padding: 10 }}>
      <Text>{children}</Text>
    </View>
  );

  /* ---------------------------------- UI ---------------------------------- */

  return (
    <View style={{ marginTop: 16 }}>
      {/* HEADER */}
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          marginBottom: 8,
        }}
      >
        <Text style={{ fontSize: 16, fontWeight: '900' }}>
          Project Milestones
        </Text>

        <Pressable
          onPress={() => {
            setEditData(null);
            setModalOpen(true);
          }}
        >
          <Feather name="plus" size={20} color="#2563eb" />
        </Pressable>
      </View>

      {/* TABLE */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View>
          {/* TABLE HEADER */}
          <View
            style={{
              flexDirection: 'row',
              backgroundColor: '#f3f4f6',
              borderBottomWidth: 1,
              borderColor: '#e5e7eb',
            }}
          >
            <Cell width={200}>Title</Cell>
            <Cell>Cost</Cell>
            <Cell>Status</Cell>
            <Cell width={120}>Start</Cell>
            <Cell width={120}>End</Cell>
            <Cell width={120}>Action</Cell>
          </View>

          {/* TABLE BODY */}
          <FlatList
            data={rows}
            keyExtractor={i => String(i.id)}
            renderItem={({ item }) => (
              <View
                style={{
                  flexDirection: 'row',
                  borderBottomWidth: 1,
                  borderColor: '#e5e7eb',
                }}
              >
                <Cell width={200}>{item.title}</Cell>
                <Cell>${item.milestoneCost}</Cell>

                <Cell>
                  <Pressable
                    onPress={() =>
                      updateStatus(
                        item.id,
                        item.status === 'COMPLETED'
                          ? 'INCOMPLETE'
                          : 'COMPLETED',
                      )
                    }
                  >
                    <Text
                      style={{
                        color:
                          item.status === 'COMPLETED' ? '#16a34a' : '#ca8a04',
                        fontWeight: '800',
                      }}
                    >
                      {item.status}
                    </Text>
                  </Pressable>
                </Cell>

                <Cell width={120}>{item.startDate}</Cell>
                <Cell width={120}>{item.endDate}</Cell>

                <Cell width={120}>
                  <View style={{ flexDirection: 'row', gap: 12 }}>
                    <Pressable
                      onPress={() => {
                        setEditData(item);
                        setModalOpen(true);
                      }}
                    >
                      <Feather name="edit" size={16} />
                    </Pressable>

                    <Pressable onPress={() => removeMilestone(item.id)}>
                      <Feather name="trash" size={16} color="#ef4444" />
                    </Pressable>
                  </View>
                </Cell>
              </View>
            )}
          />
        </View>
      </ScrollView>

      {/* ADD / EDIT MODAL */}
      <MilestoneModal
        visible={modalOpen}
        projectId={projectId}
        editData={editData}
        onClose={() => {
          setModalOpen(false);
          setEditData(null);
        }}
        onSaved={load}
      />
    </View>
  );
}

/* =============================== MODAL =============================== */

function MilestoneModal({ visible, onClose, projectId, editData, onSaved }) {
  const [title, setTitle] = useState('');
  const [cost, setCost] = useState('');
  const [summary, setSummary] = useState('');
  const [status, setStatus] = useState('INCOMPLETE');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const [picker, setPicker] = useState(null);

  useEffect(() => {
    if (!visible) return;

    if (editData) {
      setTitle(editData.title);
      setCost(String(editData.milestoneCost));
      setSummary(editData.summary);
      setStatus(editData.status);
      setStartDate(editData.startDate);
      setEndDate(editData.endDate);
    } else {
      setTitle('');
      setCost('');
      setSummary('');
      setStatus('INCOMPLETE');
      setStartDate('');
      setEndDate('');
    }
  }, [visible, editData]);

  const save = async () => {
    const payload = {
      title,
      milestoneCost: Number(cost),
      status,
      summary,
      startDate,
      endDate,
    };

    if (editData) {
      await api.put(
        `/api/projects/${projectId}/milestones/${editData.id}`,
        payload,
      );
    } else {
      await api.post(`/api/projects/${projectId}/milestones`, payload);
    }

    onSaved();
    onClose();
  };

  if (!visible) return null;

  return (
    <Modal visible transparent animationType="slide">
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1 }}
      >
        <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.4)' }} />

        <View
          style={{
            position: 'absolute',
            bottom: 0,
            width: '100%',
            maxHeight: '100%',
            backgroundColor: '#fff',
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
            padding: 16,
          }}
        >
          <Text style={{ fontSize: 18, fontWeight: '900', marginBottom: 12 }}>
            {editData ? 'Edit Milestone' : 'Add Milestone'}
          </Text>

          <ScrollView contentContainerStyle={{ paddingBottom: 120 }}>
            <Input label="Title" value={title} onChange={setTitle} />
            <Input
              label="Cost"
              value={cost}
              onChange={setCost}
              keyboardType="numeric"
            />
            <Input label="Summary" value={summary} onChange={setSummary} />

            <DateBtn
              label="Start Date"
              value={startDate}
              onPress={() => setPicker('start')}
            />
            <DateBtn
              label="End Date"
              value={endDate}
              onPress={() => setPicker('end')}
            />

            <Pressable
              style={{
                backgroundColor: '#2563eb',
                padding: 14,
                borderRadius: 12,
                alignItems: 'center',
                marginTop: 20,
              }}
              onPress={save}
            >
              <Text style={{ color: '#fff', fontWeight: '900' }}>
                Save Milestone
              </Text>
            </Pressable>
          </ScrollView>

          {picker && (
            <DateTimePicker
              value={new Date()}
              mode="date"
              onChange={(_, d) => {
                if (!d) return setPicker(null);
                const date = d.toISOString().slice(0, 10);
                picker === 'start' ? setStartDate(date) : setEndDate(date);
                setPicker(null);
              }}
            />
          )}
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

/* ------------------------------ SMALL UI ------------------------------ */

const Input = ({ label, value, onChange, ...props }) => (
  <>
    <Text style={{ fontWeight: '800', marginTop: 10 }}>{label}</Text>
    <TextInput
      value={value}
      onChangeText={onChange}
      style={{
        borderWidth: 1,
        borderColor: '#e5e7eb',
        borderRadius: 10,
        padding: 10,
        marginTop: 6,
      }}
      {...props}
    />
  </>
);

const DateBtn = ({ label, value, onPress }) => (
  <>
    <Text style={{ fontWeight: '800', marginTop: 10 }}>{label}</Text>
    <Pressable
      onPress={onPress}
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        padding: 14,
        borderWidth: 1.5,
        borderColor: '#2563eb',
        backgroundColor: '#eef2ff',
        borderRadius: 12,
        marginTop: 6,
      }}
    >
      <Feather name="calendar" size={18} color="#2563eb" />
      <Text style={{ fontWeight: '700' }}>{value || 'Select Date'}</Text>
    </Pressable>
  </>
);
