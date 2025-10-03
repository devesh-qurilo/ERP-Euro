export const FETCH_MY_LEADS_REQUEST = 'employee/leads/FETCH_MY_LEADS_REQUEST';
export const FETCH_MY_LEADS_SUCCESS = 'employee/leads/FETCH_MY_LEADS_SUCCESS';
export const FETCH_MY_LEADS_FAILURE = 'employee/leads/FETCH_MY_LEADS_FAILURE';

export const CREATE_LEAD_REQUEST = 'employee/leads/CREATE_LEAD_REQUEST';
export const CREATE_LEAD_SUCCESS = 'employee/leads/CREATE_LEAD_SUCCESS';
export const CREATE_LEAD_FAILURE = 'employee/leads/CREATE_LEAD_FAILURE';

export const fetchMyLeads = () => ({ type: FETCH_MY_LEADS_REQUEST });
export const createLead = (lead, onDone) => ({
  type: CREATE_LEAD_REQUEST,
  payload: lead,
  meta: { onDone },
});
