import React, { useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  selectBusy,
  selectList,
  selectFilters,
  selectSearch,
  selectView,
  selectModal,
  selectTotal,
  selectSource,
} from '../tasks/store/selectors';
import {
  setSource,
  setFilters,
  setSearch,
  setView,
  setModal,
  fetchTasks,
  createTask,
  updateTask,
  deleteTask,
  pinTask,
  unpinTask,
} from '../tasks/store/actions';

import TaskFiltersPanel from '../tasks/components/TaskFiltersPanel';
import TaskQuickActionsBar from '../tasks/components/TaskQuickActionsBar';
import TaskTable from '../tasks/components/TaskTable';
import TaskModal from '../../work/tasks/components/TaskModal'; // your existing modal
import TaskCalendar from '../../work/tasks/components/TaskCalendar'; // simple grouped-by-startDate view
import { View, Text } from 'react-native';

const isPinned = t => t?.pinned === true || !!t?.pinnedAt;

export default function TaskListContainer({ initialSource, onNavigateView }) {
  const dispatch = useDispatch();

  const busy = useSelector(selectBusy);
  const list = useSelector(selectList);
  const filters = useSelector(selectFilters);
  const q = useSelector(selectSearch);
  const view = useSelector(selectView);
  const modal = useSelector(selectModal);
  const total = useSelector(selectTotal);
  const source = useSelector(selectSource);

  // init source (e.g., {kind:'all'} or {kind:'project', id:3})
  useEffect(() => {
    if (initialSource) dispatch(setSource(initialSource));
    dispatch(fetchTasks());
  }, [dispatch, initialSource]);

  // search/filter on client for now (server filters can be added later)
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

  const tableData = useMemo(
    () => (view === 'pin' ? searched.filter(isPinned) : searched),
    [searched, view],
  );

  const titleSlot = (
    <View
      style={{
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
      }}
    >
      <Text style={{ fontSize: 20, fontWeight: '700', color: '#111827' }}>
        {view === 'pin' ? 'Pinned Tasks' : 'Task Details'}
      </Text>
      <View
        style={{
          backgroundColor: '#fff',
          borderRadius: 8,
          borderWidth: 1,
          borderColor: '#E5E7EB',
          paddingHorizontal: 12,
          paddingVertical: 8,
          flexDirection: 'row',
          alignItems: 'center',
        }}
      >
        <Text style={{ color: '#111827' }}>
          {filters.hideCompleted
            ? 'Showing: Without Completed'
            : 'Hide Completed Task'}
        </Text>
      </View>
    </View>
  );

  return (
    <View style={{ flex: 1 }}>
      {/* Part 1: Filters */}
      <TaskFiltersPanel
        duration={filters.duration || ''}
        onDuration={val => dispatch(setFilters({ duration: val }))}
        status={filters.status || ''}
        onStatus={val => dispatch(setFilters({ status: val }))}
      />

      {/* Part 2: Buttons that apply filters/source/view */}
      <TaskQuickActionsBar
        view={view}
        setView={mode => {
          // calendar & pin should always use ALL tasks
          if (mode === 'calendar' || mode === 'pin')
            dispatch(setSource({ kind: 'all' }));
          dispatch(setView(mode));
        }}
        sourceKind={source.kind}
        setSourceKind={kind => {
          dispatch(setSource({ kind }));
          dispatch(fetchTasks());
        }}
        onAdd={() =>
          dispatch(setModal({ visible: true, mode: 'add', record: null }))
        }
        searchValue={q}
        onSearchChange={t => dispatch(setSearch(t))}
      />

      {/* Part 3: Content area */}
      {view === 'calendar' ? (
        <TaskCalendar
          data={list} // calendar always shows ALL tasks by startDate
          onPressTask={rec => (onNavigateView ? onNavigateView(rec) : null)}
        />
      ) : (
        <TaskTable
          data={tableData}
          busy={busy}
          total={tableData.length || total}
          titleSlot={titleSlot}
          onView={rec => (onNavigateView ? onNavigateView(rec) : null)}
          onEdit={rec =>
            dispatch(setModal({ visible: true, mode: 'edit', record: rec }))
          }
          onDelete={id => dispatch(deleteTask(id))}
          onTogglePin={rec =>
            isPinned(rec)
              ? dispatch(unpinTask(rec.id))
              : dispatch(pinTask(rec.id))
          }
        />
      )}

      {/* Add/Edit modal */}
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
