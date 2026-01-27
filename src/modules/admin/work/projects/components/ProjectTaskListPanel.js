// import React, { useEffect, useMemo, useState } from 'react';
// import { View, ActivityIndicator } from 'react-native';
// import TaskListCard from '../../tasks/components/TaskListCard';
// import api from '../../../../../services/api'; // adjust path

// const isPinned = t => t?.pinned === true || !!t?.pinnedAt;

// export default function ProjectTasksByProjectId({ projectId }) {
//   const [busy, setBusy] = useState(false);
//   console.log('kkkkkkk', projectId);
//   const [tasks, setTasks] = useState([]);
//   const [hideCompleted, setHideCompleted] = useState(false);

//   useEffect(() => {
//     if (!projectId) return;

//     let mounted = true;
//     setBusy(true);

//     api
//       .get(`/projects/${projectId}/tasks`)
//       .then(res => {
//         if (mounted) setTasks(res.data || []);
//       })
//       .catch(err => {
//         console.error('Fetch project tasks failed', err);
//       })
//       .finally(() => mounted && setBusy(false));

//     return () => {
//       mounted = false;
//     };
//   }, [projectId]);

//   const data = useMemo(() => {
//     if (!hideCompleted) return tasks;
//     return tasks.filter(
//       t => (t?.taskStage?.name || '').toLowerCase() !== 'completed',
//     );
//   }, [tasks, hideCompleted]);

//   return (
//     <View style={{ marginTop: 12 }}>
//       {busy && !tasks.length ? (
//         <ActivityIndicator style={{ marginVertical: 20 }} />
//       ) : (
//         <TaskListCard
//           title="Project Tasks"
//           busy={busy}
//           data={data}
//           total={data.length}
//           onView={rec => console.log('view task', rec.id)}
//           onEdit={rec => console.log('edit task', rec.id)}
//           onDelete={id => console.log('delete task', id)}
//           onTogglePin={rec =>
//             isPinned(rec)
//               ? console.log('unpin', rec.id)
//               : console.log('pin', rec.id)
//           }
//           hideCompleted={hideCompleted}
//           onToggleHide={() => setHideCompleted(v => !v)}
//         />
//       )}
//     </View>
//   );
// }

// import React, { useCallback, useEffect, useMemo, useState } from 'react';
// import { View, ActivityIndicator } from 'react-native';
// // import TaskListCard from '../components/TaskListCard';
// import TaskModal from '../../tasks/components/TaskModal';
// import TaskListCard from '../../tasks/components/TaskListCard';
// import api from '../../../../../services/api'; // adjust path

// const isPinned = t => t?.pinned === true || !!t?.pinnedAt;

// export default function ProjectTasksByProjectId({ projectId }) {
//   const [busy, setBusy] = useState(false);
//   const [tasks, setTasks] = useState([]);
//   const [hideCompleted, setHideCompleted] = useState(false);

//   // 🔥 modal state (same UX as main screen)
//   const [modal, setModal] = useState({
//     visible: false,
//     mode: 'add',
//     record: null,
//   });

//   // ✅ single source of truth for reload
//   const loadTasks = useCallback(() => {
//     if (!projectId) return;

//     setBusy(true);
//     api
//       .get(`/projects/${projectId}/tasks`)
//       .then(res => setTasks(res.data || []))
//       .catch(err => console.error(err))
//       .finally(() => setBusy(false));
//   }, [projectId]);

//   useEffect(() => {
//     loadTasks();
//   }, [loadTasks]);

//   const data = useMemo(() => {
//     if (!hideCompleted) return tasks;
//     return tasks.filter(
//       t => (t?.taskStage?.name || '').toLowerCase() !== 'completed',
//     );
//   }, [tasks, hideCompleted]);

//   // ---------- ACTION HANDLERS ----------
//   const onDelete = async id => {
//     await api.delete(`/tasks/${id}`);
//     loadTasks(); // 🔁 refresh
//   };

//   const onTogglePin = async rec => {
//     const url = isPinned(rec)
//       ? `/tasks/${rec.id}/unpin`
//       : `/tasks/${rec.id}/pin`;
//     await api.post(url);
//     loadTasks(); // 🔁 refresh
//   };

//   const onSubmit = async payload => {
//     if (modal.mode === 'edit' && modal.record?.id) {
//       await api.put(`/tasks/${modal.record.id}`, payload);
//     } else {
//       await api.post(`/projects/${projectId}/tasks`, payload);
//     }
//     setModal({ visible: false, mode: 'add', record: null });
//     loadTasks(); // 🔁 refresh
//   };

//   return (
//     <View style={{ marginTop: 12 }}>
//       {busy && !tasks.length ? (
//         <ActivityIndicator style={{ marginVertical: 20 }} />
//       ) : (
//         <TaskListCard
//           title="Project Tasks"
//           busy={busy}
//           data={data}
//           total={data.length}
//           onAdd={() => setModal({ visible: true, mode: 'add', record: null })}
//           onView={rec => console.log('view', rec.id)}
//           onEdit={rec => setModal({ visible: true, mode: 'edit', record: rec })}
//           onDelete={onDelete}
//           onTogglePin={onTogglePin}
//           hideCompleted={hideCompleted}
//           onToggleHide={() => setHideCompleted(v => !v)}
//         />
//       )}

//       {/* 🔥 Add / Edit Task Modal */}
//       <TaskModal
//         modal={modal}
//         onClose={() => setModal({ visible: false, mode: 'add', record: null })}
//         onSubmit={onSubmit}
//       />
//     </View>
//   );
// }

import React, { useEffect, useState } from 'react';
import { View, Pressable, Text, ActivityIndicator } from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
// import TaskListCard from '../components/TaskListCard';
import TaskModal from '../components/TaskModal';
import TaskListCard from '../../tasks/components/TaskListCard';
import api from '../../../../../services/api'; // adjust path

export default function ProjectTasksByProjectId({
  projectId,
  projectMembers = [],
}) {
  const [busy, setBusy] = useState(false);
  const [tasks, setTasks] = useState([]);
  const [modal, setModal] = useState({
    visible: false,
    mode: 'add',
    record: null,
  });

  const load = async () => {
    if (!projectId) return;
    setBusy(true);
    try {
      const res = await api.get(`/projects/${projectId}/tasks`);
      setTasks(res.data || []);
    } finally {
      setBusy(false);
    }
  };

  useEffect(() => {
    load();
  }, [projectId]);

  //   const members = Array.isArray(m.assignedEmployees) ? m.assignedEmployees : [];

  return (
    <View style={{ marginTop: 12 }}>
      {/* SIMPLE ADD BUTTON */}
      <Pressable
        onPress={() =>
          setModal({
            visible: true,
            mode: 'add',
            record: { projectId },
          })
        }
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          alignSelf: 'flex-end',
          marginBottom: 10,
          paddingVertical: 8,
          paddingHorizontal: 14,
          borderRadius: 8,
          backgroundColor: '#4f46e5',
        }}
      >
        <Feather name="plus" size={18} color="#fff" />
        <Text style={{ color: '#fff', marginLeft: 6, fontWeight: '700' }}>
          Add Task
        </Text>
      </Pressable>

      {busy ? (
        <ActivityIndicator />
      ) : (
        <TaskListCard
          title="Project Tasks"
          data={tasks}
          total={tasks.length}
          busy={busy}
          onEdit={rec => setModal({ visible: true, mode: 'edit', record: rec })}
          onDelete={async id => {
            await api.delete(`/tasks/${id}`);
            load();
          }}
        />
      )}

      <TaskModal
        modal={modal}
        fixedProjectId={projectId} // 🔥 THIS IS THE MAGIC
        onClose={() => setModal({ visible: false, mode: 'add', record: null })}
        onSubmit={() => load()}
        projectMembers={projectMembers}
      />
    </View>
  );
}
