// ClientsTable.js
import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  ActivityIndicator,
} from 'react-native';

const Row = ({ children, style }) => (
  <View style={[{ flexDirection: 'row', alignItems: 'center' }, style]}>
    {children}
  </View>
);
const Col = ({ children, w }) => (
  <View
    style={{
      width: w,
      paddingVertical: 14,
      paddingHorizontal: 12,
      // borderWidth: 1,
    }}
  >
    {children}
  </View>
);
const Cell = ({ children, bold, muted, style }) => (
  <Text
    style={[
      {
        fontWeight: bold ? '700' : '400',
        color: muted ? '#6b7280' : '#111827',
      },
      style,
    ]}
  >
    {children}
  </Text>
);

export default function ClientsTable({ items = [], loading, onMenu }) {
  if (loading) {
    return (
      <View
        style={{
          borderWidth: 1,
          borderColor: '#e5e7eb',
          borderRadius: 10,
          padding: 24,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <ActivityIndicator />
      </View>
    );
  }
  return (
    <View style={{ borderWidth: 1, borderColor: '#e5e7eb', borderRadius: 10 }}>
      <ScrollView horizontal bounces={false} showsHorizontalScrollIndicator>
        <ScrollView showsVerticalScrollIndicator style={{ maxHeight: 600 }}>
          <View style={{ minWidth: 1020 }}>
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
              {/* <Col w={160}>
                <Cell bold>Status</Cell>
              </Col> */}
              <Col w={120}>
                <Cell bold>Created</Cell>
              </Col>
              <Col w={80}>
                <Cell bold>Actions</Cell>
              </Col>
            </Row>

            {/* rows */}
            {(items || []).map((c, i) => (
              <Row
                key={c.id || i}
                style={{ borderBottomWidth: 1, borderColor: '#e5e7eb' }}
              >
                <Col w={120}>
                  <Cell>
                    {c.clientId || `C-${String(c.id || i).padStart(3, '0')}`}
                  </Cell>
                </Col>
                <Col w={260}>
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    {c.profilePictureUrl ? (
                      <Image
                        source={{ uri: c.profilePictureUrl }}
                        style={{
                          width: 36,
                          height: 36,
                          borderRadius: 18,
                          marginRight: 10,
                          backgroundColor: '#f3f4f6',
                        }}
                      />
                    ) : (
                      <View
                        style={{
                          width: 36,
                          height: 36,
                          borderRadius: 18,
                          marginRight: 10,
                          backgroundColor: '#e6eefc',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        <Text style={{ fontWeight: '700', color: '#0f172a' }}>
                          {String(
                            (c?.name || '—').charAt(0) || '—',
                          ).toUpperCase()}
                        </Text>
                      </View>
                    )}
                    <View>
                      <Cell bold>{c?.name || '—'}</Cell>
                      <Cell muted style={{ marginTop: 4 }}>
                        {c.company?.companyName || '—'}
                      </Cell>
                    </View>
                  </View>
                </Col>
                <Col w={280}>
                  <Cell>{(c?.email || '-').slice(0, 30) || '—'}</Cell>
                  <Cell muted style={{ marginTop: 6 }}>
                    {c?.mobile || '—'}
                  </Cell>
                </Col>
                <Col w={160}>
                  <Cell>{(c?.category || '').slice(0, 15) || '-'}</Cell>
                  {c?.subCategory ? (
                    <Cell muted style={{ marginTop: 6 }}>
                      {c?.subCategory}
                    </Cell>
                  ) : null}
                </Col>
                {/* <Col w={160}>
                  <View
                    style={{
                      backgroundColor:
                        c.status === 'ACTIVE' ? '#ecfdf5' : '#fff7ed',
                      paddingVertical: 6,
                      paddingHorizontal: 10,
                      borderRadius: 999,
                      alignSelf: 'flex-start',
                    }}
                  >
                    <Text
                      style={{
                        color: c.status === 'ACTIVE' ? '#065f46' : '#92400e',
                        fontWeight: '700',
                      }}
                    >
                      {c.status || '—'}
                    </Text>
                  </View>
                </Col> */}
                <Col w={120}>
                  <Cell>{(c?.createdAt || '').slice(0, 10) || '—'}</Cell>
                </Col>
                <Col w={80}>
                  <TouchableOpacity
                    onPress={() => onMenu(c)}
                    style={{
                      alignSelf: 'flex-start',
                      paddingHorizontal: 12,
                      paddingVertical: 8,
                      // borderRadius: 10,
                      // borderWidth: 1,
                      borderColor: '#d1d5db',
                      // backgroundColor: '#fff',
                    }}
                  >
                    <Text style={{ fontSize: 24, color: '#000' }}>⋮</Text>
                  </TouchableOpacity>
                </Col>
              </Row>
            ))}
          </View>
        </ScrollView>
      </ScrollView>
    </View>
  );
}
