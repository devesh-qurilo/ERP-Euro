export const clientsState = state => state?.admin?.clients;

export const getClients = state => clientsState(state)?.items ?? [];
export const getClientsLoading = state => clientsState(state)?.loading ?? false;
export const getClientsSaving = state => clientsState(state)?.saving ?? false;
export const getClientQuery = state =>
  clientsState(state)?.query ?? { page: 0, size: 20 };

export const getClientsModal = state => ({
  visible: clientsState(state)?.modalVisible ?? false,
  mode: clientsState(state)?.modalMode ?? 'view',
});
export const getSelectedClient = state => clientsState(state)?.selected ?? null;
