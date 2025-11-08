import React from 'react';
import {
  Modal,
  View,
  Text,
  Pressable,
  StyleSheet,
  Linking,
} from 'react-native';

export default function PaymentViewModal({ visible, payment, onClose }) {
  if (!visible) return null;
  const p = payment || {};
  return (
    <Modal visible transparent animationType="fade" onRequestClose={onClose}>
      <View style={s.backdrop}>
        <View style={s.card}>
          <Text style={s.ttl}>Payment Details</Text>

          <Row k="Transaction ID" v={p.transactionId || '—'} />
          <Row k="Status" v={p.status || '—'} />
          <Row k="Amount" v={`${p.currency || ''} ${p.amount ?? '—'}`} />
          <Row k="Gateway" v={p.paymentGateway?.name || '—'} />
          <Row k="Date" v={p.paymentDate || '—'} />
          <Row k="Project" v={p.project?.projectName || '—'} />
          <Row k="Client" v={p.client?.name || '—'} />
          <Row k="Invoice #" v={p.invoice?.invoiceNumber || '—'} />
          <Row k="Note" v={p.note || '—'} />

          {!!p.receiptFileUrl && (
            <Pressable
              style={s.btn}
              onPress={() => Linking.openURL(p.receiptFileUrl)}
            >
              <Text style={s.btnTxt}>Download Receipt</Text>
            </Pressable>
          )}

          <Pressable style={[s.btn, s.close]} onPress={onClose}>
            <Text style={[s.btnTxt, { color: '#fff' }]}>Close</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}
function Row({ k, v }) {
  return (
    <View style={{ marginBottom: 6 }}>
      <Text style={{ fontSize: 12, color: '#64748b' }}>{k}</Text>
      <Text style={{ fontSize: 14, color: '#0f172a' }}>{String(v)}</Text>
    </View>
  );
}
const s = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    padding: 16,
  },
  card: { backgroundColor: '#fff', borderRadius: 12, padding: 16, gap: 8 },
  ttl: { fontSize: 18, fontWeight: '900', color: '#0b0b0c', marginBottom: 8 },
  btn: {
    borderWidth: 1,
    borderColor: '#1d4ed8',
    borderRadius: 10,
    paddingVertical: 10,
    alignItems: 'center',
  },
  btnTxt: { color: '#1d4ed8', fontWeight: '600' },
  close: { backgroundColor: '#1d4ed8', borderColor: '#1d4ed8', marginTop: 8 },
});
