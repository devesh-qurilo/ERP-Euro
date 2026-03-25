// components/InvoiceTable.js
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
const Col = ({ children, w = 160 }) => (
  <View style={{ width: w, paddingVertical: 10, paddingHorizontal: 8 }}>
    {children}
  </View>
);
const Dot = ({ color = '#999' }) => (
  <View
    style={{ width: 10, height: 10, borderRadius: 5, backgroundColor: color }}
  />
);
const statusColor = s => {
  const S = String(s || '').toUpperCase();
  if (S === 'PAID') return '#22c55e';
  if (S === 'UNPAID') return '#ef4444';
  if (S.includes('CREDIT')) return '#eab308';
  return '#6b7280';
};

export default function InvoiceTable({
  items,
  loading,
  onOpenActions,
  minWidth = 1000,
  maxHeight = 540,
}) {
  if (loading) {
    return (
      <View
        style={{
          padding: 20,
          alignItems: 'center',
          justifyContent: 'center',
          borderWidth: 1,
          borderColor: '#e5e7eb',
          borderRadius: 10,
        }}
      >
        <ActivityIndicator />
      </View>
    );
  }

  return (
    <View
      style={{
        borderWidth: 1,
        borderColor: '#e5e7eb',
        borderRadius: 10,
        overflow: 'hidden',
      }}
    >
      <ScrollView
        horizontal
        contentContainerStyle={{ minWidth }}
        showsHorizontalScrollIndicator
      >
        <View style={{ minWidth }}>
          <Row
            style={{
              backgroundColor: '#f9fafb',
              borderBottomWidth: 1,
              borderColor: '#e5e7eb',
            }}
          >
            <Col w={120}>
              <Text style={{ fontWeight: '700' }}>Code</Text>
            </Col>
            <Col w={140}>
              <Text style={{ fontWeight: '700' }}>Invoice</Text>
            </Col>
            <Col w={180}>
              <Text style={{ fontWeight: '700' }}>Project</Text>
            </Col>
            <Col w={240}>
              <Text style={{ fontWeight: '700' }}>Client</Text>
            </Col>
            <Col w={220}>
              <Text style={{ fontWeight: '700' }}>Total</Text>
            </Col>
            <Col w={160}>
              <Text style={{ fontWeight: '700' }}>Invoice Date</Text>
            </Col>
            <Col w={140}>
              <Text style={{ fontWeight: '700' }}>Status</Text>
            </Col>
            <Col w={120}>
              <Text style={{ fontWeight: '700' }}>Actions</Text>
            </Col>
          </Row>

          <ScrollView
            style={{ maxHeight }}
            nestedScrollEnabled
            showsVerticalScrollIndicator
          >
            {items?.length ? (
              items.map((row, idx) => (
                <Row
                  key={row.id || idx}
                  style={{ borderBottomWidth: 1, borderColor: '#e5e7eb' }}
                >
                  <Col w={120}>
                    <Text>{row.project?.projectCode || '—'}</Text>
                  </Col>
                  <Col w={140}>
                    <Text>{row.invoiceNumber}</Text>
                  </Col>
                  <Col w={180}>
                    <Text numberOfLines={1}>
                      {row.project?.projectName || '—'}
                    </Text>
                  </Col>
                  <Col w={240}>
                    <Row>
                      {!!row.client?.profilePictureUrl && (
                        <Image
                          source={{ uri: row.client.profilePictureUrl }}
                          style={{
                            width: 28,
                            height: 28,
                            borderRadius: 14,
                            marginRight: 8,
                          }}
                        />
                      )}
                      <View>
                        <Text numberOfLines={1}>{row.client?.name || '—'}</Text>
                        <Text style={{ fontSize: 12, color: '#9ca3af' }}>
                          Project
                        </Text>
                      </View>
                    </Row>
                  </Col>
                  <Col w={220}>
                    <View>
                      <Text>
                        Total :{' '}
                        {Number(row.total ?? 0).toLocaleString(undefined, {
                          minimumFractionDigits: 2,
                        })}
                      </Text>
                      <Text style={{ color: '#16a34a' }}>
                        Paid :{' '}
                        {Number(row.paidAmount || 0).toLocaleString(undefined, {
                          minimumFractionDigits: 2,
                        })}
                      </Text>
                      <Text style={{ color: '#ef4444' }}>
                        Unpaid :{' '}
                        {Number(row.unpaidAmount || 0).toLocaleString(
                          undefined,
                          { minimumFractionDigits: 2 },
                        )}
                      </Text>
                    </View>
                  </Col>
                  <Col w={160}>
                    <Text style={{ fontSize: 16, fontWeight: '700' }}>
                      {row.invoiceDate}
                    </Text>
                  </Col>
                  <Col w={140}>
                    <Row>
                      <Dot color={statusColor(row.status)} />
                      <Text style={{ marginLeft: 8 }}>{row.status}</Text>
                    </Row>
                  </Col>
                  <Col w={120}>
                    <TouchableOpacity
                      onPress={() => onOpenActions && onOpenActions(row)}
                      activeOpacity={0.8}
                      style={{
                        alignSelf: 'flex-start',
                        paddingHorizontal: 14,
                        paddingVertical: 10,
                        borderRadius: 10,
                        borderWidth: 1,
                        borderColor: '#d1d5db',
                      }}
                    >
                      <Text style={{ fontSize: 18 }}>⋮</Text>
                    </TouchableOpacity>
                  </Col>
                </Row>
              ))
            ) : (
              <View style={{ padding: 18 }}>
                <Text style={{ color: '#6b7280' }}>No invoices found.</Text>
              </View>
            )}
          </ScrollView>
        </View>
      </ScrollView>
    </View>
  );
}
