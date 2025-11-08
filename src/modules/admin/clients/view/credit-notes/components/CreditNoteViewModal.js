import React from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  Pressable,
  ScrollView,
  Linking,
} from 'react-native';

export default function CreditNoteViewModal({ visible, item, onClose }) {
  if (!visible || !item) return null;
  return (
    <Modal visible transparent animationType="fade" onRequestClose={onClose}>
      <View style={s.backdrop}>
        <View style={s.card}>
          <Text style={s.ttl}>Credit Note • {item.creditNoteNumber}</Text>
          <ScrollView style={{ maxHeight: 420 }}>
            <Row k="Date" v={item.creditNoteDate} />
            <Row k="Currency" v={item.currency} />
            <Row k="Amount" v={String(item.amount)} />
            <Row k="Tax %" v={String(item.tax)} />
            <Row
              k="Adjustment"
              v={`${item.adjustmentPositive ? '+' : '-'}${item.adjustment}`}
            />
            <Row k="Client" v={item.client?.name} />
            <Row k="Project" v={item.project?.projectName} />
            <Row k="Notes" v={item.notes} />
            {item.fileUrl ? (
              <Pressable
                style={s.btn}
                onPress={() => Linking.openURL(item.fileUrl)}
              >
                <Text style={s.btnTxt}>Download File</Text>
              </Pressable>
            ) : null}
          </ScrollView>
          <Pressable style={[s.btn, s.close]} onPress={onClose}>
            <Text style={s.btnTxt}>Close</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}

function Row({ k, v }) {
  return (
    <View style={s.row}>
      <Text style={s.k}>{k}</Text>
      <Text style={s.v}>{v ?? '—'}</Text>
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
  card: { backgroundColor: '#fff', borderRadius: 12, padding: 16 },
  ttl: { fontSize: 18, fontWeight: '900', color: '#0b0b0c', marginBottom: 8 },
  row: { marginBottom: 8 },
  k: { fontSize: 12, color: '#64748b' },
  v: { color: '#0f172a', fontWeight: '600' },
  btn: {
    borderWidth: 1,
    borderColor: '#1d4ed8',
    borderRadius: 10,
    paddingVertical: 10,
    alignItems: 'center',
    marginTop: 8,
  },
  btnTxt: { color: '#1d4ed8', fontWeight: '700' },
  close: { backgroundColor: '#1d4ed8' },
});
