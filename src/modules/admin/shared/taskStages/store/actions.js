import * as T from './types';

export const stagesFetch = () => ({ type: T.STAGES_FETCH_REQ });
export const stageCreate = payload => ({ type: T.STAGE_CREATE_REQ, payload }); // {name, position, labelColor}
export const stageUpdate = (id, payload) => ({
  type: T.STAGE_UPDATE_REQ,
  id,
  payload,
});
export const stageDelete = id => ({ type: T.STAGE_DELETE_REQ, id });
