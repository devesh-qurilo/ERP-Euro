import React from 'react';
import { View, Text, Image } from 'react-native';
import TaskActionsMenu from './TaskActionsMenu';
import { Col } from './ui';

const fmtDate = d => (d ? new Date(d).toLocaleDateString() : '---');
const Priority = ({ p }) => {
  const bg =
    p === 'LOW'
      ? '#D1F2D6'
      : p === 'HIGH' || p === 'URGENT'
      ? '#FFD7D7'
      : '#FFE7BF';
  const txt = p ? p[0] + p.slice(1).toLowerCase() : '';
  return (
    <View
      style={{
        backgroundColor: bg,
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 20,
        alignSelf: 'flex-start',
      }}
    >
      <Text style={{ fontSize: 12 }}>{txt}</Text>
    </View>
  );
};

export default function TaskRow({
  item,
  onView,
  onEdit,
  onDelete,
  onTogglePin,
}) {
  return (
    <View
      style={{
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderColor: '#F3F3F3',
      }}
    >
      <Col style={{ minWidth: 100 }}>
        <Text>#{String(item.id).padStart(6, '0')}</Text>
      </Col>

      <Col style={{ minWidth: 320 }}>
        <Text style={{ fontWeight: '700', color: '#111827' }}>
          {item.title}
        </Text>
        <Text style={{ color: '#6B7280', marginTop: 3 }}>ERP Project</Text>
        {!!item.priority && (
          <View style={{ marginTop: 6 }}>
            <Priority p={item.priority} />
          </View>
        )}
      </Col>

      <Col>
        <Text>{fmtDate(item.startDate)}</Text>
      </Col>
      <Col>
        <Text>{fmtDate(item.dueDate)}</Text>
      </Col>
      <Col>
        <Text>
          {item.timeEstimateMinutes ? `${item.timeEstimateMinutes} min` : '---'}
        </Text>
      </Col>
      <Col>
        <Text>---</Text>
      </Col>
      <Col>
        <Text>0s</Text>
      </Col>

      <Col
        style={{
          minWidth: 140,
          flexDirection: 'row',
          alignItems: 'center',
          gap: 6,
        }}
      >
        {(item.assignedEmployees || []).slice(0, 1).map(a => (
          <Image
            key={a.employeeId}
            source={{ uri: a.profileUrl }}
            style={{ width: 30, height: 30, borderRadius: 15 }}
          />
        ))}
      </Col>

      <Col>
        <View
          style={{
            width: 150,
            height: 38,
            backgroundColor: '#fff',
            borderRadius: 8,
            borderWidth: 1,
            borderColor: '#E5E7EB',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingHorizontal: 12,
          }}
        >
          <Text>{item?.taskStage?.name || '—'}</Text>
          <Text>▾</Text>
        </View>
      </Col>

      <Col style={{ minWidth: 120 }}>
        <TaskActionsMenu
          pinned={!!item?.pinned}
          onView={onView}
          onEdit={onEdit}
          onPin={onTogglePin}
          onDelete={onDelete}
        />
      </Col>
    </View>
  );
}
