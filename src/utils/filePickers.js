// src/utils/filePickers.js
import { pick } from '@react-native-documents/picker';

export async function pickSingleDoc({
  type = ['image/*'],
  copyTo = 'cachesDirectory',
} = {}) {
  const res = await pick({ type, allowMultiSelection: false, copyTo });
  // res.assets = [{ name, size, type, uri, copyUri, fileCopyUri }]
  const a = res?.assets?.[0];
  if (!a) return null;

  // Prefer copyUri/fileCopyUri for stable access
  const uri = a.fileCopyUri || a.copyUri || a.uri;
  const name = a.name || 'upload';
  const mime = a.type || 'application/octet-stream';

  return { uri, name, type: mime };
}
