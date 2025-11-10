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

import HeaderToolbar from '../components/HeaderToolbar';
import TaskListCard from '../components/TaskListCard';
import TaskModal from '../components/TaskModal';
import TaskCalendar from '../components/TaskCalendar';
import TopFilters from '../components/TopFilters';

const isPinned = t => t?.pinned === true || !!t?.pinnedAt;

export default function AdminWorkTaskScreen() {
  const dispatch = useDispatch();
  const nav = useNavigation();

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

  const searched = useMemo(() => {
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

  const tableData = useMemo(() => {
    if (view === 'pin') return searched.filter(isPinned);
    return searched;
  }, [searched, view]);

  const goView = rec => nav.navigate('AdminTaskDetail', { taskId: rec.id });

  return (
    <View style={{ flex: 1, backgroundColor: '#F6F7F9', padding: 14 }}>
      {/* 1) Top filter row like your screenshot */}
      <TopFilters
        status={filters.status || ''}
        onStatusChange={val => dispatch(setFilters({ status: val }))}
        duration={filters.duration || ''}
        onDurationChange={val => dispatch(setFilters({ duration: val }))}
      />

      {/* 2) Toolbar with 7 buttons in your wording */}
      <HeaderToolbar
        view={view}
        onChangeView={mode => dispatch(setViewMode(mode))}
        onAdd={() =>
          dispatch(setModal({ visible: true, mode: 'add', record: null }))
        }
        onMyTask={() => {
          /* add filter to my tasks later if you want */
        }}
        onApprove={() => dispatch(setViewMode('approval'))}
        search={q}
        onSearch={t => dispatch(setSearch(t))}
      />

      {/* 3) Content area: Calendar vs Table */}
      {view === 'calendar' ? (
        <TaskCalendar
          data={list} // Calendar shows ALL tasks (grouped by startDate)
          onPressTask={goView}
        />
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

      {/* 4) Add/Edit modal */}
      <TaskModal
        modal={modal}
        onClose={() => dispatch(setModal({ visible: false, record: null }))}
        onSubmit={payload => {
          if (modal.mode === 'edit' && modal.record?.id)
            dispatch(updateTask(modal.record.id, payload));
          else dispatch(createTask(payload));
        }}
      />
    </View>
  );
}
