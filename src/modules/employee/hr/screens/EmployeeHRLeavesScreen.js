import React, { useEffect, useMemo, useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Alert,
  Image,
  Dimensions,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import LeavesTable from '../components/LeavesTable';
import { fetchMyLeaves } from '../store/actions';
import {
  selectMyLeavesData,
  selectMyLeavesLoading,
  selectMyLeavesError,
} from '../store/selectors';

import ApplyLeaveModal from '../components/ApplyLeaveModal';

const { width } = Dimensions.get('window');

function Select({ label, value, options = [], onChange }) {
  const [open, setOpen] = useState(false);

  return (
    <View style={styles.selectWrap}>
      <Text style={styles.selectLabel}>{label}</Text>
      <Pressable
        onPress={() => setOpen(v => !v)}
        style={[styles.selectBtn, open && styles.selectBtnOpen]}
      >
        <Text style={styles.selectValue}>{value}</Text>
        <View style={styles.selectCaretContainer}>
          <Text style={[styles.selectCaret, open && styles.selectCaretOpen]}>
            {open ? '▴' : '▾'}
          </Text>
        </View>
      </Pressable>
      {open && (
        <View style={styles.selectMenu}>
          <ScrollView style={styles.selectMenuScroll} nestedScrollEnabled>
            {options.map((opt, index) => (
              <Pressable
                key={opt}
                onPress={() => {
                  onChange(opt);
                  setOpen(false);
                }}
                style={[
                  styles.selectItem,
                  index === options.length - 1 && styles.selectItemLast,
                  value === opt && styles.selectItemActive,
                ]}
              >
                <Text
                  style={[
                    styles.selectItemText,
                    value === opt && styles.selectItemTextActive,
                  ]}
                >
                  {opt}
                </Text>
              </Pressable>
            ))}
          </ScrollView>
        </View>
      )}
    </View>
  );
}

export default function EmployeeHRLeavesScreen() {
  const dispatch = useDispatch();
  const raw = useSelector(selectMyLeavesData);
  const loading = useSelector(selectMyLeavesLoading);
  const error = useSelector(selectMyLeavesError);
  const [showModal, setShowModal] = useState(false);

  const onNewLeave = () => setShowModal(true);

  const load = useCallback(() => dispatch(fetchMyLeaves()), [dispatch]);

  useEffect(() => {
    load();
  }, [load]);

  const employeeOptions = useMemo(() => {
    const set = new Set(
      (Array.isArray(raw) ? raw : []).map(r => r.employeeName).filter(Boolean),
    );
    return ['All', ...Array.from(set)];
  }, [raw]);

  const [employee, setEmployee] = useState('All');
  const designationOptions = [
    'All',
    'Junior SDE',
    'SDE',
    'Sr. SDE',
    'Team Lead',
    'Manager',
  ];
  const [designation, setDesignation] = useState('All');
  const [view, setView] = useState('list');

  const filtered = useMemo(() => {
    let rows = Array.isArray(raw) ? raw : [];
    if (employee !== 'All')
      rows = rows.filter(
        r => (r.employeeName || '').toLowerCase() === employee.toLowerCase(),
      );
    if (designation !== 'All')
      rows = rows.filter(r => (r.designation || '—') === designation);
    return rows;
  }, [raw, employee, designation]);

  const PAGE_SIZE = 10;
  const [page, setPage] = useState(1);

  useEffect(() => {
    setPage(1);
  }, [employee, designation]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const pageData = useMemo(
    () => filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE),
    [filtered, page],
  );

  const onPrev = () => setPage(p => Math.max(1, p - 1));
  const onNext = () => setPage(p => Math.min(totalPages, p + 1));
  const goTo = n => setPage(n);

  //   const onNewLeave = () =>
  //     Alert.alert('New Leave Request', 'New Leave form will open here.', [
  //       { text: 'Cancel', style: 'cancel' },
  //       { text: 'Continue', style: 'default' },
  //     ]);

  const onCalendar = () => {
    setView('calendar');
    Alert.alert('Calendar View', 'Calendar view will be implemented soon.');
  };

  const onProfile = () => {
    setView('profile');
    Alert.alert('Profile View', 'Profile view will be implemented soon.');
  };

  const clearFilters = () => {
    setEmployee('All');
    setDesignation('All');
    setPage(1);
  };

  const renderPaginationNumbers = () => {
    const numbers = [];
    const maxVisible = 5;
    let start = Math.max(1, page - Math.floor(maxVisible / 2));
    let end = Math.min(totalPages, start + maxVisible - 1);

    if (end - start + 1 < maxVisible) {
      start = Math.max(1, end - maxVisible + 1);
    }

    for (let i = start; i <= end; i++) {
      numbers.push(
        <Pressable
          key={i}
          onPress={() => goTo(i)}
          style={[styles.pageNum, page === i && styles.pageNumActive]}
        >
          <Text
            style={[styles.pageNumText, page === i && styles.pageNumTextActive]}
          >
            {i}
          </Text>
        </Pressable>,
      );
    }

    return numbers;
  };

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.screen}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.headerTitle}>Leave Management</Text>
            <Text style={styles.headerSubtitle}>
              {filtered.length} {filtered.length === 1 ? 'record' : 'records'}{' '}
              found
            </Text>
          </View>

          {/* Refresh Button */}
          <Pressable
            style={styles.refreshBtn}
            onPress={load}
            disabled={loading}
          >
            <Text style={styles.refreshIcon}>🔄</Text>
          </Pressable>
        </View>

        {/* Toolbar */}
        <View style={styles.toolbar}>
          {/* Filters Row */}
          <View style={styles.filtersRow}>
            <View style={styles.selectContainer}>
              <Select
                label="Employee"
                value={employee}
                options={employeeOptions}
                onChange={setEmployee}
              />
            </View>

            <View style={styles.selectContainer}>
              <Select
                label="Designation"
                value={designation}
                options={designationOptions}
                onChange={setDesignation}
              />
            </View>

            <Pressable
              style={styles.filterBtn}
              onPress={() =>
                Alert.alert(
                  'Advanced Filters',
                  'Date range, status, and other filters coming soon.',
                )
              }
            >
              <Text style={styles.filterIcon}>⚙️</Text>
              <Text style={styles.filterText}>More</Text>
            </Pressable>
          </View>

          {/* Clear Filters */}
          {(employee !== 'All' || designation !== 'All') && (
            <Pressable style={styles.clearBtn} onPress={clearFilters}>
              <Text style={styles.clearIcon}>✕</Text>
              <Text style={styles.clearText}>Clear Filters</Text>
            </Pressable>
          )}

          {/* Actions Row */}
          <View style={styles.actionsRow}>
            <Pressable style={styles.newBtn} onPress={onNewLeave}>
              <Text style={styles.plus}>+</Text>
              <Text style={styles.newBtnText}>New Leave</Text>
            </Pressable>

            <View style={styles.viewTabs}>
              <Pressable
                onPress={() => setView('list')}
                style={[styles.tabBtn, view === 'list' && styles.tabActive]}
              >
                <Text
                  style={[
                    styles.tabIcon,
                    view === 'list' && styles.tabIconActive,
                  ]}
                >
                  ≣
                </Text>
                <Text
                  style={[
                    styles.tabText,
                    view === 'list' && styles.tabTextActive,
                  ]}
                >
                  List
                </Text>
              </Pressable>

              <Pressable
                onPress={onCalendar}
                style={[styles.tabBtn, view === 'calendar' && styles.tabActive]}
              >
                <Text
                  style={[
                    styles.tabIcon,
                    view === 'calendar' && styles.tabIconActive,
                  ]}
                >
                  📅
                </Text>
                <Text
                  style={[
                    styles.tabText,
                    view === 'calendar' && styles.tabTextActive,
                  ]}
                >
                  Calendar
                </Text>
              </Pressable>

              <Pressable
                onPress={onProfile}
                style={[styles.tabBtn, view === 'profile' && styles.tabActive]}
              >
                <Text
                  style={[
                    styles.tabIcon,
                    view === 'profile' && styles.tabIconActive,
                  ]}
                >
                  👤
                </Text>
                <Text
                  style={[
                    styles.tabText,
                    view === 'profile' && styles.tabTextActive,
                  ]}
                >
                  Profile
                </Text>
              </Pressable>
            </View>
          </View>
        </View>

        {/* Content */}
        <View style={styles.content}>
          {view === 'list' ? (
            <View style={styles.tableContainer}>
              <LeavesTable
                dataOverride={pageData}
                loadingOverride={loading}
                autoFetch={false}
              />
            </View>
          ) : (
            <View style={styles.placeholder}>
              <Text style={styles.placeholderIcon}>
                {view === 'calendar' ? '📅' : '👤'}
              </Text>
              <Text style={styles.placeholderTitle}>
                {view === 'calendar' ? 'Calendar View' : 'Profile View'}
              </Text>
              <Text style={styles.placeholderText}>
                This feature is coming soon. Stay tuned for updates!
              </Text>
            </View>
          )}
        </View>

        {/* Pagination */}
        {filtered.length > 0 && (
          <View style={styles.paginationContainer}>
            <View style={styles.paginationInfo}>
              <Text style={styles.paginationText}>
                Showing {(page - 1) * PAGE_SIZE + 1} -{' '}
                {Math.min(page * PAGE_SIZE, filtered.length)} of{' '}
                {filtered.length}
              </Text>
            </View>

            <View style={styles.pager}>
              <Pressable
                onPress={onPrev}
                style={[styles.pageBtn, page === 1 && styles.pageBtnDisabled]}
                disabled={page === 1}
              >
                <Text
                  style={[styles.pageTxt, page === 1 && styles.pageTxtDisabled]}
                >
                  ← Previous
                </Text>
              </Pressable>

              <View style={styles.pageNumbers}>
                {renderPaginationNumbers()}
              </View>

              <Pressable
                onPress={onNext}
                style={[
                  styles.pageBtn,
                  page === totalPages && styles.pageBtnDisabled,
                ]}
                disabled={page === totalPages}
              >
                <Text
                  style={[
                    styles.pageTxt,
                    page === totalPages && styles.pageTxtDisabled,
                  ]}
                >
                  Next →
                </Text>
              </Pressable>
            </View>
          </View>
        )}

        {/* Error Display */}
        {error && (
          <View style={styles.errorContainer}>
            <Text style={styles.errorIcon}>⚠️</Text>
            <Text style={styles.errorNote}>{String(error)}</Text>
            <Pressable style={styles.retryBtn} onPress={load}>
              <Text style={styles.retryText}>Retry</Text>
            </Pressable>
          </View>
        )}
        <ApplyLeaveModal
          visible={showModal}
          onClose={() => setShowModal(false)}
        />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  screen: {
    padding: 16,
    gap: 16,
    paddingBottom: 32,
  },

  // Header
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: '#1f2937',
    letterSpacing: -0.5,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 2,
  },
  refreshBtn: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  refreshIcon: {
    fontSize: 16,
  },

  // Toolbar
  toolbar: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    gap: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  filtersRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 12,
    flexWrap: 'wrap',
  },
  selectContainer: {
    flex: 1,
    minWidth: 120,
  },
  actionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: 12,
  },

  // Clear Filters
  clearBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fef2f2',
    borderWidth: 1,
    borderColor: '#fecaca',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  clearIcon: {
    fontSize: 12,
    color: '#dc2626',
    marginRight: 6,
  },
  clearText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#dc2626',
  },

  // Select
  selectWrap: {
    position: 'relative',
    zIndex: 1000,
  },
  selectLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 6,
  },
  selectBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#e5e7eb',
    backgroundColor: '#fff',
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: 10,
    minWidth: 130,
    transition: 'all 0.2s',
  },
  selectBtnOpen: {
    borderColor: '#3b82f6',
    shadowColor: '#3b82f6',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  selectValue: {
    fontSize: 15,
    color: '#111827',
    flex: 1,
    fontWeight: '500',
  },
  selectCaretContainer: {
    marginLeft: 8,
  },
  selectCaret: {
    fontSize: 14,
    color: '#6b7280',
    fontWeight: '600',
  },
  selectCaretOpen: {
    color: '#3b82f6',
  },
  selectMenu: {
    position: 'absolute',
    top: '100%',
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#e5e7eb',
    marginTop: 4,
    maxHeight: 200,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
    zIndex: 2000,
  },
  selectMenuScroll: {
    maxHeight: 180,
  },
  selectItem: {
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#f1f5f9',
  },
  selectItemLast: {
    borderBottomWidth: 0,
  },
  selectItemActive: {
    backgroundColor: '#eff6ff',
  },
  selectItemText: {
    fontSize: 15,
    color: '#111827',
    fontWeight: '500',
  },
  selectItemTextActive: {
    color: '#2563eb',
    fontWeight: '600',
  },

  // Filter button
  filterBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#e5e7eb',
    backgroundColor: '#fff',
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: 10,
    minWidth: 100,
  },
  filterIcon: {
    marginRight: 8,
    fontSize: 16,
  },
  filterText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#111827',
  },

  // New leave button
  newBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2563eb',
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: 10,
    shadowColor: '#2563eb',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  plus: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '600',
    marginRight: 8,
    marginTop: -2,
  },
  newBtnText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '700',
  },

  // View tabs
  viewTabs: {
    flexDirection: 'row',
    backgroundColor: '#f8fafc',
    borderRadius: 10,
    padding: 4,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  tabBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
    minWidth: 70,
  },
  tabActive: {
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  tabIcon: {
    fontSize: 16,
    color: '#6b7280',
    marginRight: 4,
  },
  tabIconActive: {
    color: '#2563eb',
  },
  tabText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6b7280',
  },
  tabTextActive: {
    color: '#2563eb',
  },

  // Content
  content: {
    flex: 1,
  },
  tableContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 1,
  },

  // Placeholder
  placeholder: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 48,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 1,
  },
  placeholderIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  placeholderTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 8,
  },
  placeholderText: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
    lineHeight: 20,
  },

  // Pagination
  paginationContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  paginationInfo: {
    alignItems: 'center',
    marginBottom: 12,
  },
  paginationText: {
    fontSize: 13,
    color: '#6b7280',
    fontWeight: '500',
  },
  pager: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  pageBtn: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  pageBtnDisabled: {
    opacity: 0.5,
    backgroundColor: '#f1f5f9',
  },
  pageTxt: {
    color: '#374151',
    fontWeight: '600',
    fontSize: 14,
  },
  pageTxtDisabled: {
    color: '#9ca3af',
  },
  pageNumbers: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  pageNum: {
    width: 36,
    height: 36,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  pageNumActive: {
    backgroundColor: '#2563eb',
    borderColor: '#2563eb',
  },
  pageNumText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6b7280',
  },
  pageNumTextActive: {
    color: '#fff',
  },

  // Error
  errorContainer: {
    backgroundColor: '#fef2f2',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#fecaca',
  },
  errorIcon: {
    fontSize: 20,
    marginRight: 12,
  },
  errorNote: {
    flex: 1,
    color: '#dc2626',
    fontSize: 14,
    fontWeight: '500',
  },
  retryBtn: {
    backgroundColor: '#dc2626',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    marginLeft: 12,
  },
  retryText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
});
