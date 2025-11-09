export const selectCVD = s => s?.admin?.clientsViewDocuments;

export const selectCVDDocs = s => selectCVD(s)?.list || [];
export const selectCVDLoading = s => !!selectCVD(s)?.loading;
export const selectCVDUploading = s => !!selectCVD(s)?.uploading;
export const selectCVDBusyIds = s => selectCVD(s)?.busyIds || [];
