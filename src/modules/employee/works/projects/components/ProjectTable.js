import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  Pressable,
} from 'react-native';
import { useDispatch } from 'react-redux';
import { togglePinProject } from '../store/actions';

const fmt = d =>
  d
    ? new Date(d).toLocaleDateString(undefined, {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
      })
    : '—';

const COLUMNS = [
  { key: 'act', title: 'Actions', width: 170 },
  { key: 'name', title: 'Project Name', width: 260 },
  { key: 'mem', title: 'Members', width: 190 },
  { key: 'start', title: 'Start Date', width: 180 },
  { key: 'active', title: 'Last Active', width: 180 },
  { key: 'client', title: 'Clients', width: 240 },
  { key: 'status', title: 'Status', width: 260 },
  { key: 'act', title: 'Actions', width: 120 },
];

function Avatars({ list = [] }) {
  const shown = list.slice(0, 4);
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
      {shown.map((e, i) => (
        <View
          key={e.employeeId || i}
          style={[styles.avatarWrap, { marginLeft: i ? -10 : 0 }]}
        >
          {e.profileUrl ? (
            <Image source={{ uri: e.profileUrl }} style={styles.avatar} />
          ) : (
            <View style={[styles.avatar, styles.avatarEmpty]}>
              <Text>👤</Text>
            </View>
          )}
        </View>
      ))}
      {list.length > 4 && (
        <View style={[styles.more]}>
          <Text style={{ fontSize: 12, fontWeight: '900' }}>
            +{list.length - 4}
          </Text>
        </View>
      )}
    </View>
  );
}

function ProgressBar({ percent }) {
  const p = Math.max(0, Math.min(100, Number(percent ?? 0)));
  const color = p >= 75 ? '#22c55e' : p >= 40 ? '#f59e0b' : '#ef4444';
  return (
    <View style={styles.progressWrap}>
      <View
        style={[
          styles.progressFill,
          { width: `${p}%`, backgroundColor: color },
        ]}
      />
      <Text style={styles.progressTxt}>{p}%</Text>
    </View>
  );
}

function StatusCell({ item }) {
  const status = (item.projectStatus || 'In Progress')
    .replace(/_/g, ' ')
    .toLowerCase()
    .replace(/\b\w/g, s => s.toUpperCase());
  return (
    <View style={{ gap: 6 }}>
      <ProgressBar percent={item.progressPercent ?? 0} />
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
        <View
          style={{
            width: 8,
            height: 8,
            borderRadius: 4,
            backgroundColor: '#3b82f6',
          }}
        />
        <Text style={{ color: '#374151', fontWeight: '700' }}>{status}</Text>
      </View>
    </View>
  );
}

export default function ProjectsTable({ data, onView }) {
  const dispatch = useDispatch();

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator
      style={styles.hscroll}
    >
      <View style={{ minWidth: COLUMNS.reduce((s, c) => s + c.width, 0) }}>
        {/* header */}
        <View style={styles.headerRow}>
          {COLUMNS.map(col => (
            <View key={col.key} style={[styles.th, { width: col.width }]}>
              <Text style={styles.thTxt}>{col.title}</Text>
            </View>
          ))}
        </View>

        {/* rows */}
        {data.map((p, idx) => (
          <View key={p.id} style={[styles.tr, idx % 2 ? styles.alt : null]}>
            {/* Code */}
            <View style={[styles.td, { width: COLUMNS[0].width }]}>
              <Text style={styles.codeTxt}>#{p.shortCode || p.id}</Text>
            </View>

            {/* Name (wrap to 2 lines) */}
            <View style={[styles.td, { width: COLUMNS[1].width }]}>
              <Text numberOfLines={2} style={styles.nameTxt}>
                {p.name}
              </Text>
            </View>

            {/* Members */}
            <View style={[styles.td, { width: COLUMNS[2].width }]}>
              <Avatars list={p.assignedEmployees} />
            </View>

            {/* Start */}
            <View style={[styles.td, { width: COLUMNS[3].width }]}>
              <Text style={styles.cellTxt}>{fmt(p.startDate)}</Text>
            </View>

            {/* Last Active (use createdAt as placeholder) */}
            <View style={[styles.td, { width: COLUMNS[4].width }]}>
              <Text style={styles.cellTxt}>
                {fmt(p.updatedAt || p.createdAt)}
              </Text>
            </View>

            {/* Client */}
            <View style={[styles.td, { width: COLUMNS[5].width }]}>
              <View
                style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}
              >
                {p.client?.profilePictureUrl ? (
                  <Image
                    source={{ uri: p.client.profilePictureUrl }}
                    style={styles.clientAvatar}
                  />
                ) : (
                  <View style={[styles.clientAvatar, styles.avatarEmpty]}>
                    <Text>👤</Text>
                  </View>
                )}
                <View style={{ flex: 1 }}>
                  <Text numberOfLines={1} style={styles.clientName}>
                    {p.client?.name || '—'}
                  </Text>
                  <Text numberOfLines={1} style={styles.clientOrg}>
                    {p.companyName || ''}
                  </Text>
                </View>
              </View>
            </View>

            {/* Status */}
            <View style={[styles.td, { width: COLUMNS[6].width }]}>
              <StatusCell item={p} />
            </View>

            {/* Actions */}
            <View
              style={[
                styles.td,
                { width: COLUMNS[7].width, flexDirection: 'row', gap: 8 },
              ]}
            >
              <Pressable
                onPress={() =>
                  dispatch(togglePinProject(p.id, !p.pinned, !!p.pinned))
                }
                style={[styles.squareBtn, p.pinned && styles.squareBtnActive]}
              >
                <Text style={[styles.btnTxt, p.pinned && styles.btnTxtActive]}>
                  {p.pinned ? '📌' : '📍'}
                </Text>
              </Pressable>
              <Pressable
                onPress={() =>
                  typeof onView === 'function' ? onView(p) : null
                }
                style={styles.squareBtn}
              >
                <Text style={styles.btnTxt}>👁️</Text>
              </Pressable>
            </View>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  hscroll: {
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    backgroundColor: '#fff',
  },

  headerRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  th: { paddingVertical: 14, paddingHorizontal: 12 },
  thTxt: { fontSize: 16, fontWeight: '900', color: '#0b0b0c' },

  tr: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#eef2f7',
  },
  alt: { backgroundColor: '#fafafa' },
  td: { paddingHorizontal: 12, justifyContent: 'center' },

  codeTxt: { fontWeight: '800', color: '#111827' },
  nameTxt: { fontSize: 16, fontWeight: '800', color: '#111827' },
  cellTxt: { color: '#1f2937', fontWeight: '700' },

  avatarWrap: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 2,
    borderColor: '#fff',
    overflow: 'hidden',
  },
  avatar: { width: 36, height: 36, borderRadius: 18 },
  avatarEmpty: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f3f4f6',
  },
  more: {
    width: 36,
    height: 36,
    borderRadius: 18,
    marginLeft: -10,
    backgroundColor: '#e5e7eb',
    alignItems: 'center',
    justifyContent: 'center',
  },

  clientAvatar: { width: 40, height: 40, borderRadius: 20 },
  clientName: { fontWeight: '900', color: '#111827' },
  clientOrg: { color: '#6b7280', marginTop: 2 },

  progressWrap: {
    height: 22,
    borderRadius: 8,
    backgroundColor: '#e5e7eb',
    overflow: 'hidden',
    justifyContent: 'center',
  },
  progressFill: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    borderRadius: 8,
  },
  progressTxt: { textAlign: 'center', fontWeight: '900', color: '#111827' },

  squareBtn: {
    width: 38,
    height: 38,
    borderRadius: 10,
    backgroundColor: '#f3f4f6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  squareBtnActive: { backgroundColor: '#111827' },
  btnTxt: { fontSize: 16, fontWeight: '900', color: '#111827' },
  btnTxtActive: { color: '#fff' },
  pinActive: { backgroundColor: '#111827' },
  pinTxt: { fontSize: 16, fontWeight: '900', color: '#111827' },
  pinTxtActive: { color: '#fff' },
});
