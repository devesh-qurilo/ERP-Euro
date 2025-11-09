import React, { useEffect, useMemo } from 'react';
import { View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';

import {
  fetchTasks,
  setFilters,
  setSearch,
  setViewMode,
  setModal,
  createTask,
  updateTask,
  deleteTask,
  pinTask,
  unpinTask,
} from '../../tasks/store/actions';

import {
  selectBusy,
  selectList,
  selectFilters,
  selectSearch,
  selectView,
  selectModal,
  selectTotal,
} from '../../tasks/store/selectors';

import TopFilters from '../components/TopFilters';
import HeaderToolbar from '../components/HeaderToolbar';
import TaskListCard from '../components/TaskListCard';
import TaskModal from '../components/TaskModal';

export default function AdminWorkTaskScreen() {
  const dispatch = useDispatch();

  const busy = useSelector(selectBusy);
  const list = useSelector(selectList);
  const filters = useSelector(selectFilters);
  const q = useSelector(selectSearch);
  const view = useSelector(selectView);
  const modal = useSelector(selectModal);
  const total = useSelector(selectTotal);

  useEffect(() => {
    dispatch(fetchTasks());
  }, [dispatch]);

  const filtered = useMemo(() => {
    const term = (q || '').trim().toLowerCase();
    return list.filter(x => {
      if (
        filters.hideCompleted &&
        (x?.taskStage?.name || '').toLowerCase() === 'completed'
      )
        return false;
      if (!term) return true;
      return (
        (x.title || '').toLowerCase().includes(term) ||
        (x?.categoryId?.name || '').toLowerCase().includes(term)
      );
    });
  }, [list, q, filters]);

  return (
    <View style={{ flex: 1, backgroundColor: '#F6F7F9', padding: 14 }}>
      {/* 1) Filters row (Duration, Status etc.) */}
      <TopFilters
        status={filters.status || ''}
        onStatusChange={val => dispatch(setFilters({ status: val }))}
        duration={filters.duration || ''}
        onDurationChange={val => dispatch(setFilters({ duration: val }))}
      />

      {/* 2) Toolbar (Add Task / My Task + view switch) */}
      <HeaderToolbar
        view={view}
        onChangeView={mode => dispatch(setViewMode(mode))}
        onAdd={() =>
          dispatch(setModal({ visible: true, mode: 'add', record: null }))
        }
        onMyTask={() => {
          /* navigate/filter my tasks */
        }}
        onApprove={() => dispatch(setViewMode('approval'))}
      />

      {/* 3) White Card with Title + horizontal table */}
      <TaskListCard
        title="Task Details"
        busy={busy}
        data={filtered}
        total={total}
        onView={rec =>
          dispatch(setModal({ visible: true, mode: 'view', record: rec }))
        }
        onEdit={rec =>
          dispatch(setModal({ visible: true, mode: 'edit', record: rec }))
        }
        onDelete={id => dispatch(deleteTask(id))}
        onTogglePin={rec =>
          rec?.pinned ? dispatch(unpinTask(rec.id)) : dispatch(pinTask(rec.id))
        }
        hideCompleted={!!filters.hideCompleted}
        onToggleHide={() =>
          dispatch(setFilters({ hideCompleted: !filters.hideCompleted }))
        }
      />

      {/* Add/Edit/View Modal */}
      <TaskModal
        modal={modal}
        onClose={() => dispatch(setModal({ visible: false, record: null }))}
        onSubmit={payload => {
          if (modal.mode === 'edit' && modal.record?.id) {
            dispatch(updateTask(modal.record.id, payload));
          } else {
            dispatch(createTask(payload));
          }
        }}
      />
    </View>
  );
}
