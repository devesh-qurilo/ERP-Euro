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
