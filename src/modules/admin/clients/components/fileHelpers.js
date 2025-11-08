// src/modules/admin/clients/components/fileHelpers.js
import * as DocumentPicker from '@react-native-documents/picker';
export const toRNFile = d => ({
  uri: d.fileCopyUri || d.uri,
  name: d.name || 'upload.bin',
  type: d.type || 'application/octet-stream',
});

export async function pickImageOrDoc() {
  const res = await DocumentPicker.pick({
    type: [DocumentPicker.types.images, DocumentPicker.types.pdf],
    copyTo: 'cachesDirectory',
  });
  const doc = Array.isArray(res) ? res[0] : res;
  return toRNFile(doc);
}
