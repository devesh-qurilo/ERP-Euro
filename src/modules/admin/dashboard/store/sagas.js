// // src/modules/admin/dashboard/store/sagas.js
// import { all, call, put, takeLatest } from 'redux-saga/effects';
// import api from '../../../../services/api'; // adjust path if needed
// import {
//   FETCH_ADMIN_DASHBOARD_COUNTS_REQUEST,
//   fetchAdminDashboardCountsSuccess,
//   fetchAdminDashboardCountsFailure,
// } from './actions';

// /**
//  * Worker saga: fetch four endpoints in parallel
//  */
// function* fetchCountsWorker() {
//   try {
//     // parallel calls
//     const [projectsRes, tasksRes, dealsRes, followupsRes] = yield all([
//       call([api, api.get], '/api/projects/counts'),
//       call([api, api.get], '/api/projects/tasks/status/counts'),
//       call([api, api.get], '/deals/stats'),
//       call([api, api.get], '/deals/followups/summary'),
//     ]);

//     // response.data is expected by your api wrapper; handle both shapes
//     const projects = projectsRes?.data ?? projectsRes;
//     const tasks = tasksRes?.data ?? tasksRes;
//     const deals = dealsRes?.data ?? dealsRes;
//     const followups = followupsRes?.data ?? followupsRes;

//     yield put(
//       fetchAdminDashboardCountsSuccess({
//         projects,
//         tasks,
//         deals,
//         followups,
//       }),
//     );
//   } catch (err) {
//     console.error(
//       '[adminDashboard] fetchCountsWorker error:',
//       err?.message || err,
//     );
//     yield put(
//       fetchAdminDashboardCountsFailure(
//         err?.message || 'Failed to fetch dashboard counts',
//       ),
//     );
//   }
// }

// /**
//  * Watcher saga
//  */
// export function* adminDashboardWatcher() {
//   yield takeLatest(FETCH_ADMIN_DASHBOARD_COUNTS_REQUEST, fetchCountsWorker);
// }

// src/modules/admin/dashboard/store/sagas.js
import { all, call, put, takeLatest } from 'redux-saga/effects';
import api from '../../../../services/api';
import {
  FETCH_ADMIN_DASHBOARD_COUNTS_REQUEST,
  fetchAdminDashboardCountsSuccess,
  fetchAdminDashboardCountsFailure,
} from './actions';

/**
 * Helper to compute safe percentage (0-100)
 */
function pct(part, total) {
  const t = Number(total) || 0;
  if (!t) return 0;
  return Math.round(((Number(part) || 0) / t) * 100);
}

function* fetchCountsWorker() {
  try {
    const [projectsRes, tasksRes, dealsRes, followupsRes] = yield all([
      call([api, api.get], '/api/projects/counts'),
      call([api, api.get], '/api/projects/tasks/status/counts'),
      call([api, api.get], '/deals/stats'),
      call([api, api.get], '/deals/followups/summary'),
    ]);

    const projects = projectsRes?.data ?? projectsRes;
    const tasks = tasksRes?.data ?? tasksRes;
    const deals = dealsRes?.data ?? dealsRes;
    const followups = followupsRes?.data ?? followupsRes;

    // derived metrics for UI (rings/percent)
    const projectsTotal =
      Number(projects.pendingCount || 0) + Number(projects.overdueCount || 0) ||
      0;
    const tasksTotal =
      Number(tasks.pendingCount || 0) + Number(tasks.overdueCount || 0) || 0;
    const dealsTotal = Number(deals.totalDeals || 0);
    const converted = Number(deals.convertedDeals || 0);

    const payload = {
      projects,
      tasks,
      deals,
      followups,
      derived: {
        projectsOverduePct: pct(projects.overdueCount, projectsTotal),
        tasksOverduePct: pct(tasks.overdueCount, tasksTotal),
        dealsConvertedPct: pct(converted, dealsTotal),
        followupsUpcomingPct: pct(
          followups.upcomingCount,
          followups.upcomingCount + followups.pendingCount,
        ),
      },
    };

    yield put(fetchAdminDashboardCountsSuccess(payload));
  } catch (err) {
    console.error(
      '[adminDashboard] fetchCountsWorker error:',
      err?.message || err,
    );
    yield put(
      fetchAdminDashboardCountsFailure(
        err?.message || 'Failed to fetch dashboard counts',
      ),
    );
  }
}

export function* adminDashboardWatcher() {
  yield takeLatest(FETCH_ADMIN_DASHBOARD_COUNTS_REQUEST, fetchCountsWorker);
}
