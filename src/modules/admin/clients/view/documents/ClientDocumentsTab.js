// // src/modules/admin/clients/view/documents/ClientDocumentsTab.js
// import React, { useEffect, useMemo } from 'react';
// import {
//   View,
//   Text,
//   Pressable,
//   ScrollView,
//   StyleSheet,
//   Linking,
//   ActivityIndicator,
//   Alert,
// } from 'react-native';
// import { useDispatch, useSelector } from 'react-redux';
// import { pick, types } from '@react-native-documents/picker';
// import { listByClient, uploadOne, deleteOne } from './store/actions';
// import {
//   selectCVDDocs,
//   selectCVDLoading,
//   selectCVDUploading,
//   selectCVDBusyIds,
// } from './store/selectors';
// import { clientDocumentsAPI } from '../../../../../services/api';

// export default function ClientDocumentsTab({ route }) {
//   const clientId = route;
//   const dispatch = useDispatch();
//   const docs = useSelector(selectCVDDocs);
//   const loading = useSelector(selectCVDLoading);
//   const uploading = useSelector(selectCVDUploading);
//   const busyIds = useSelector(selectCVDBusyIds);

//   useEffect(() => {
//     if (clientId) dispatch(listByClient(clientId));
//   }, [clientId, dispatch]);

//   const onUpload = async () => {
//     try {
//       // @react-native-documents/picker
//       const result = await pick({
//         allowMultiSelection: false,
//         type: [types.allFiles], // you can restrict to [types.pdf, types.images] if needed
//         copyTo: 'cachesDirectory',
//       });

//       // result.files = array; we asked for single select
//       const f = Array.isArray(result?.files) ? result.files[0] : result?.files;
//       if (!f) return;

//       const file = {
//         uri: f.fileCopyUri || f.uri,
//         name: f.name || 'upload.bin',
//         type: f.type || 'application/octet-stream',
//       };
//       dispatch(uploadOne(clientId, file));
//     } catch (err) {
//       if (DocumentPicker.isCancel(err)) return;
//       Alert.alert('Error', err?.message || 'Pick failed');
//     }
//   };

//   const onView = item => {
//     const url = item.url;
//     if (url)
//       Linking.openURL(url).catch(() =>
//         Alert.alert('Error', 'Cannot open file URL'),
//       );
//   };

//   const onDownload = item => {
//     // Prefer direct file URL; else try API download endpoint (may require auth headers)
//     if (item.url) {
//       Linking.openURL(item.url).catch(() =>
//         Alert.alert('Error', 'Cannot open file URL'),
//       );
//       return;
//     }
//     const direct = clientDocumentsAPI.downloadUrl(clientId, item.id);
//     Linking.openURL(direct).catch(() =>
//       Alert.alert('Error', 'Download endpoint blocked by auth; use View.'),
//     );
//   };

//   const onDelete = item => {
//     Alert.alert('Delete document', `Remove "${item.filename}"?`, [
//       { text: 'Cancel' },
//       {
//         text: 'Delete',
//         style: 'destructive',
//         onPress: () => dispatch(deleteOne(clientId, item.id)),
//       },
//     ]);
//   };

//   const header = [
//     'Filename',
//     'Type',
//     'Size',
//     'Uploaded At',
//     'Uploaded By',
//     'Actions',
//   ];

//   return (
//     <ScrollView contentContainerStyle={{ padding: 12 }}>
//       {/* Top bar */}
//       <View style={styles.headerRow}>
//         <Text style={styles.title}>Documents</Text>
//         <Pressable
//           style={[styles.btn, styles.primary]}
//           onPress={onUpload}
//           disabled={uploading}
//         >
//           <Text style={[styles.btnTxt, { color: '#fff' }]}>
//             {uploading ? 'Uploading…' : '+ Add Document'}
//           </Text>
//         </Pressable>
//       </View>

//       {/* Table */}
//       <ScrollView horizontal style={styles.hscroll}>
//         <View style={styles.table}>
//           {/* Head */}
//           <View style={[styles.row, styles.head]}>
//             {header.map(h => (
//               <Text key={h} style={[styles.cell, styles.hcell]}>
//                 {h}
//               </Text>
//             ))}
//           </View>

//           {/* Body */}
//           {loading ? (
//             <ActivityIndicator style={{ margin: 16 }} />
//           ) : docs.length === 0 ? (
//             <View style={{ padding: 16 }}>
//               <Text style={{ color: '#6b7280' }}>No documents uploaded.</Text>
//             </View>
//           ) : (
//             docs.map(item => {
//               const busy = busyIds.includes(item.id);
//               return (
//                 <View key={item.id} style={styles.row}>
//                   <Text
//                     style={[styles.cell, { minWidth: 260 }]}
//                     numberOfLines={1}
//                   >
//                     {item.filename}
//                   </Text>
//                   <Text style={styles.cell}>{item.mimeType || '—'}</Text>
//                   <Text style={styles.cell}>
//                     {item.size != null
//                       ? `${Math.ceil(item.size / 1024)} KB`
//                       : '—'}
//                   </Text>
//                   <Text style={styles.cell}>
//                     {item.uploadedAt?.replace('T', ' ').replace('Z', '') || '—'}
//                   </Text>
//                   <Text style={styles.cell}>{item.uploadedBy || '—'}</Text>
//                   <View style={[styles.cell, styles.actions]}>
//                     <Pressable
//                       style={styles.dotBtn}
//                       onPress={() => onView(item)}
//                     >
//                       <Text>👁️ View</Text>
//                     </Pressable>
//                     <Pressable
//                       style={styles.dotBtn}
//                       onPress={() => onDownload(item)}
//                     >
//                       <Text>⬇️ Download</Text>
//                     </Pressable>
//                     <Pressable
//                       style={styles.dotBtn}
//                       disabled={busy}
//                       onPress={() => onDelete(item)}
//                     >
//                       <Text>{busy ? '…' : '🗑️ Delete'}</Text>
//                     </Pressable>
//                   </View>
//                 </View>
//               );
//             })
//           )}
//         </View>
//       </ScrollView>
//     </ScrollView>
//   );
// }

// const styles = StyleSheet.create({
//   headerRow: {
//     marginBottom: 10,
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//   },
//   title: { fontSize: 18, fontWeight: '800', color: '#0b0b0c' },
//   btn: {
//     borderWidth: 1,
//     borderColor: '#1d4ed8',
//     borderRadius: 10,
//     paddingHorizontal: 14,
//     paddingVertical: 10,
//     backgroundColor: '#fff',
//   },
//   primary: { backgroundColor: '#1d4ed8' },
//   btnTxt: { fontWeight: '500', color: '#111827' },

//   hscroll: {
//     borderRadius: 12,
//     borderWidth: 1,
//     borderColor: '#e5e7eb',
//     backgroundColor: '#fff',
//   },
//   table: { minWidth: 1000 },
//   row: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     borderBottomWidth: 1,
//     borderBottomColor: '#f1f5f9',
//   },
//   head: { backgroundColor: '#f8fafc' },
//   cell: { paddingVertical: 12, paddingHorizontal: 12, minWidth: 160 },
//   hcell: { fontWeight: '800', color: '#111827' },
//   actions: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     gap: 8,
//     minWidth: 300,
//   },
//   dotBtn: {
//     paddingHorizontal: 8,
//     paddingVertical: 6,
//     borderWidth: 1,
//     borderColor: '#e5e7eb',
//     borderRadius: 8,
//     backgroundColor: '#fff',
//     marginRight: 8,
//   },
// });

import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Pressable,
  ScrollView,
  StyleSheet,
  Linking,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { pick, types } from '@react-native-documents/picker';
import { listByClient, uploadOne, deleteOne } from './store/actions';
import {
  selectCVDDocs,
  selectCVDLoading,
  selectCVDUploading,
  selectCVDBusyIds,
} from './store/selectors';

export default function ClientDocumentsTab({ route }) {
  const clientId = route;
  const dispatch = useDispatch();

  const docs = useSelector(selectCVDDocs);
  const loading = useSelector(selectCVDLoading);
  const uploading = useSelector(selectCVDUploading);
  const busyIds = useSelector(selectCVDBusyIds);

  const [openMenuId, setOpenMenuId] = useState(null);

  useEffect(() => {
    if (clientId) dispatch(listByClient(clientId));
  }, [clientId, dispatch]);

  const formatDate = dateString => {
    if (!dateString) return '—';
    const d = new Date(dateString);
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    return `${day}-${month}-${year}`;
  };

  const formatSize = bytes => {
    if (!bytes && bytes !== 0) return '—';
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  const onUpload = async () => {
    try {
      const result = await pick({
        allowMultiSelection: false,
        type: [types.allFiles],
        copyTo: 'cachesDirectory',
      });

      const f = Array.isArray(result?.files) ? result.files[0] : result?.files;

      if (!f) return;

      dispatch(
        uploadOne(clientId, {
          uri: f.fileCopyUri || f.uri,
          name: f.name || 'upload.bin',
          type: f.type || 'application/octet-stream',
        }),
      );
    } catch (err) {
      Alert.alert('Error', err?.message || 'File selection failed');
    }
  };

  const onView = item => {
    if (item.url) {
      Linking.openURL(item.url).catch(() =>
        Alert.alert('Error', 'Cannot open file'),
      );
    }
  };

  const onDelete = item => {
    Alert.alert('Delete document', `Remove "${item.filename}"?`, [
      { text: 'Cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => dispatch(deleteOne(clientId, item.id)),
      },
    ]);
  };

  return (
    <View style={{ flex: 1, padding: 12 }}>
      {/* Header */}
      <View style={styles.headerRow}>
        <Text style={styles.title}>Documents</Text>
        <Pressable
          style={[styles.btn, styles.primary, uploading && { opacity: 0.7 }]}
          onPress={onUpload}
          disabled={uploading}
        >
          <Text style={styles.btnTxt}>
            {uploading ? 'Uploading…' : '+ Add Document'}
          </Text>
        </Pressable>
      </View>

      <View style={styles.tableWrapper}>
        {loading ? (
          <ActivityIndicator style={{ margin: 20 }} />
        ) : docs.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={{ fontSize: 32 }}>📁</Text>
            <Text style={{ fontWeight: '700', marginTop: 10 }}>
              No Documents Uploaded
            </Text>
            <Text style={{ color: '#6b7280', marginTop: 4 }}>
              Upload documents related to this client.
            </Text>
          </View>
        ) : (
          <ScrollView horizontal>
            <View style={{ minWidth: 1100 }}>
              {/* Header Row */}
              <View style={[styles.row, styles.head]}>
                <Text style={[styles.cell, styles.hcell, { width: 280 }]}>
                  Filename
                </Text>
                <Text style={[styles.cell, styles.hcell, { width: 180 }]}>
                  Type
                </Text>
                <Text style={[styles.cell, styles.hcell, { width: 120 }]}>
                  Size
                </Text>
                <Text style={[styles.cell, styles.hcell, { width: 160 }]}>
                  Uploaded At
                </Text>
                <Text style={[styles.cell, styles.hcell, { width: 160 }]}>
                  Uploaded By
                </Text>
                <Text style={[styles.cell, styles.hcell, { width: 120 }]}>
                  Actions
                </Text>
              </View>

              {docs.map((item, index) => {
                const busy = busyIds.includes(item.id);
                const menuOpen = openMenuId === item.id;

                return (
                  <View
                    key={item.id}
                    style={[
                      styles.row,
                      {
                        backgroundColor: index % 2 === 0 ? '#fff' : '#fafafa',
                      },
                    ]}
                  >
                    <Text
                      style={[styles.cell, { width: 280 }]}
                      numberOfLines={1}
                    >
                      {item.filename}
                    </Text>

                    <Text style={[styles.cell, { width: 180 }]}>
                      {item.mimeType || '—'}
                    </Text>

                    <Text style={[styles.cell, { width: 120 }]}>
                      {formatSize(item.size)}
                    </Text>

                    <Text style={[styles.cell, { width: 160 }]}>
                      {formatDate(item.uploadedAt)}
                    </Text>

                    <Text style={[styles.cell, { width: 160 }]}>
                      {item.uploadedBy || '—'}
                    </Text>

                    <View
                      style={[
                        styles.cell,
                        { width: 120, alignItems: 'flex-end' },
                      ]}
                    >
                      {busy ? (
                        <ActivityIndicator size="small" />
                      ) : (
                        <>
                          <Pressable
                            style={styles.kebabBtn}
                            onPress={() =>
                              setOpenMenuId(menuOpen ? null : item.id)
                            }
                          >
                            <Text style={styles.kebabTxt}>⋮</Text>
                          </Pressable>

                          {menuOpen && (
                            <View style={styles.menu}>
                              <Pressable
                                style={styles.menuItem}
                                onPress={() => {
                                  setOpenMenuId(null);
                                  onView(item);
                                }}
                              >
                                <Text>View</Text>
                              </Pressable>

                              <Pressable
                                style={styles.menuItem}
                                onPress={() => {
                                  setOpenMenuId(null);
                                  onDelete(item);
                                }}
                              >
                                <Text style={{ color: '#b91c1c' }}>Delete</Text>
                              </Pressable>
                            </View>
                          )}
                        </>
                      )}
                    </View>
                  </View>
                );
              })}
            </View>
          </ScrollView>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  headerRow: {
    marginBottom: 14,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  title: { fontSize: 18, fontWeight: '800', color: '#111827' },

  btn: {
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },

  primary: { backgroundColor: '#1d4ed8' },

  btnTxt: { color: '#fff', fontWeight: '600' },

  tableWrapper: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 12,
    backgroundColor: '#fff',
  },

  row: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },

  head: {
    backgroundColor: '#f8fafc',
  },

  cell: {
    paddingVertical: 12,
    paddingHorizontal: 12,
  },

  hcell: {
    fontWeight: '700',
    color: '#111827',
  },

  kebabBtn: {
    padding: 6,
    borderRadius: 6,
  },

  kebabTxt: {
    fontSize: 18,
    fontWeight: '700',
  },

  menu: {
    position: 'absolute',
    top: 30,
    right: 0,
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    width: 140,
    elevation: 6,
    zIndex: 999,
  },

  menuItem: {
    paddingVertical: 10,
    paddingHorizontal: 12,
  },

  emptyState: {
    paddingVertical: 50,
    alignItems: 'center',
  },
});
