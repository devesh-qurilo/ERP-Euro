import * as T from './types';

export const fetchKanban = () => ({ type: T.FETCH_REQ });

export const moveCard = (dealId, toStageName) => ({
  type: T.MOVE_CARD_REQ,
  dealId,
  toStageName,
});

// stage management
export const createStage = payload => ({ type: T.STAGE_CREATE_REQ, payload });
export const updateStage = (id, payload) => ({
  type: T.STAGE_UPDATE_REQ,
  id,
  payload,
});
export const deleteStage = id => ({ type: T.STAGE_DELETE_REQ, id });

export const setBusy = busy => ({ type: T.SET_BUSY, busy });
