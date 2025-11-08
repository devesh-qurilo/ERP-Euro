// src/modules/admin/clients/components/ClientsTable.js
import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image } from 'react-native';

const Row = ({ children, style }) => (
  <View style={[{ flexDirection: 'row', alignItems: 'center' }, style]}>
    {children}
  </View>
);
const Col = ({ children, w }) => (
  <View style={{ width: w, paddingVertical: 14, paddingHorizontal: 12 }}>
    {children}
  </View>
);
const Cell = ({ children, bold, muted }) => (
  <Text
    style={{
      fontWeight: bold ? '700' : '400',
      color: muted ? '#6b7280' : '#111827',
    }}
  >
    {children}
  </Text>
);

export default function ClientsTable({ items = [], loading, onMenu }) {
  return (
    <View style={{ borderWidth: 1, borderColor: '#e5e7eb', borderRadius: 10 }}>
      <ScrollView horizontal bounces={false} showsHorizontalScrollIndicator>
        <View style={{ minWidth: 1200 }}>
          {/* header */}
          <Row
            style={{
              backgroundColor: '#f9fafb',
              borderBottomWidth: 1,
              borderColor: '#e5e7eb',
            }}
          >
            <Col w={120}>
              <Cell bold>Client ID</Cell>
            </Col>
            <Col w={260}>
              <Cell bold>Name</Cell>
            </Col>
            <Col w={280}>
              <Cell bold>Contact Details</Cell>
            </Col>
            <Col w={160}>
              <Cell bold>Category</Cell>
            </Col>
            <Col w={160}>
              <Cell bold>Status</Cell>
            </Col>
            <Col w={180}>
              <Cell bold>Created</Cell>
            </Col>
            <Col w={120}>
              <Cell bold>Actions</Cell>
            </Col>
          </Row>

          {/* rows */}
          {(loading ? [] : items).map((c, i) => (
            <Row
              key={c.id || i}
              style={{ borderBottomWidth: 1, borderColor: '#e5e7eb' }}
            >
              <Col w={120}>
                <Cell>
                  {c.clientId || `C-${String(c.id).padStart(3, '0')}`}
                </Cell>
              </Col>
              <Col w={260}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  {c.profilePictureUrl ? (
                    <Image
                      source={{ uri: c.profilePictureUrl }}
                      style={{
                        width: 28,
                        height: 28,
                        borderRadius: 14,
                        marginRight: 8,
                      }}
                    />
                  ) : null}
                  <View>
                    <Cell>{c.name}</Cell>
                    <Cell muted>{c.company?.companyName || '—'}</Cell>
                  </View>
                </View>
              </Col>
              <Col w={280}>
                <Cell>{c.email || '—'}</Cell>
                <Cell muted>{c.mobile || '—'}</Cell>
              </Col>
              <Col w={160}>
                <Cell>{c.category || '—'}</Cell>
              </Col>
              <Col w={160}>
                <Cell>● Active</Cell>
              </Col>
              <Col w={180}>
                <Cell>{String(c.createdAt).slice(0, 10)}</Cell>
              </Col>
              <Col w={120}>
                <TouchableOpacity
                  onPress={() => onMenu(c)}
                  style={{
                    alignSelf: 'flex-start',
                    paddingHorizontal: 12,
                    paddingVertical: 8,
                    borderRadius: 10,
                    borderWidth: 1,
                    borderColor: '#d1d5db',
                  }}
                >
                  <Text style={{ fontSize: 18 }}>⋮</Text>
                </TouchableOpacity>
              </Col>
            </Row>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}
