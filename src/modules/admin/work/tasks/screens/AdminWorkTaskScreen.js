import React, { useEffect, useMemo } from 'react';
import { View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';

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
  setScope,
} from '../../tasks/store/actions';

import {
  selectBusy,
  selectList,
  selectFilters,
  selectSearch,
  selectView,
  selectModal,
  selectTotal,
  selectScope,
} from '../../tasks/store/selectors';

import HeaderToolbar from '../components/HeaderToolbar';
import TaskListCard from '../components/TaskListCard';
import TaskModal from '../components/TaskModal';
import TaskCalendar from '../components/TaskCalendar';
import TopFilters from '../components/TopFilters';

// 👇 NEW: Kanban
import KanbanBoard from '../../../shared/tasks/components/KanbanBoard';

const isPinned = t => t?.pinned === true || !!t?.pinnedAt;

export default function AdminWorkTaskScreen() {
  const dispatch = useDispatch();
  const nav = useNavigation();

  const scope = useSelector(selectScope);
  const busy = useSelector(selectBusy);
  const list = useSelector(selectList) || [];
  const filters = useSelector(selectFilters) || {};
  const q = useSelector(selectSearch) || '';
  const view = useSelector(selectView) || 'list';
  const modal = useSelector(selectModal) || { visible: false };
  const total = useSelector(selectTotal) || 0;

  useEffect(() => {
    dispatch(fetchTasks());
  }, [dispatch, scope]);

  const searched = useMemo(() => {
    const term = q.trim().toLowerCase();
    return (list || []).filter(x => {
      if (
        filters.hideCompleted &&
        (x?.taskStage?.name || '').toLowerCase() === 'completed'
      ) {
        return false;
      }
      if (!term) return true;
      return (
        (x?.title || '').toLowerCase().includes(term) ||
        (x?.categoryId?.name || '').toLowerCase().includes(term)
      );
    });
  }, [list, q, filters]);

  const tableData = useMemo(() => {
    if (view === 'pin') return searched.filter(isPinned);
    return searched;
  }, [searched, view]);

  const goView = rec => nav.navigate('AdminTaskDetail', { taskId: rec.id });

  return (
    <View style={{ flex: 1, backgroundColor: '#F6F7F9', padding: 14 }}>
      {/* 1) Top filters */}
      <TopFilters
        status={filters.status || ''}
        onStatusChange={val => dispatch(setFilters({ status: val }))}
        duration={filters.duration || ''}
        onDurationChange={val => dispatch(setFilters({ duration: val }))}
      />

      {/* 2) Toolbar with 7 buttons (now also driving kanban) */}
      <HeaderToolbar
        view={view}
        onChangeView={mode => {
          // pin, calendar, kanban operate on ALL tasks
          if (mode === 'calendar' || mode === 'pin' || mode === 'kanban') {
            if (scope !== 'all') dispatch(setScope('all'));
            dispatch(fetchTasks());
          }
          dispatch(setViewMode(mode));
        }}
        onAdd={() =>
          dispatch(setModal({ visible: true, mode: 'add', record: null }))
        }
        onMyTask={() => {
          dispatch(setScope('my'));
          dispatch(setViewMode('list'));
          dispatch(fetchTasks());
        }}
        onApprove={() => dispatch(setViewMode('approval'))}
        search={q}
        onSearch={t => dispatch(setSearch(t))}
      />

      {/* 3) Content: Kanban | Calendar | Table */}
      {view === 'kanban' ? (
        <KanbanBoard onCardPress={goView} />
      ) : view === 'calendar' ? (
        <TaskCalendar data={list} onPressTask={goView} />
      ) : (
        <TaskListCard
          title={view === 'pin' ? 'Pinned Tasks' : 'Task Details'}
          busy={busy}
          data={tableData}
          total={tableData.length || total}
          onView={goView}
          onEdit={rec =>
            dispatch(setModal({ visible: true, mode: 'edit', record: rec }))
          }
          onDelete={id => dispatch(deleteTask(id))}
          onTogglePin={rec =>
            isPinned(rec)
              ? dispatch(unpinTask(rec.id))
              : dispatch(pinTask(rec.id))
          }
          hideCompleted={!!filters.hideCompleted}
          onToggleHide={() =>
            dispatch(setFilters({ hideCompleted: !filters.hideCompleted }))
          }
        />
      )}

      {/* 4) Add/Edit Task modal */}
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
