// SINGLE reducer: core (your existing switch) + projectFiles + taskDetails

import {
  FETCH_PROJECTS_REQUEST,
  FETCH_PROJECTS_SUCCESS,
  FETCH_PROJECTS_FAILURE,
  TOGGLE_PIN_PROJECT_REQUEST,
  TOGGLE_PIN_PROJECT_SUCCESS,
  TOGGLE_PIN_PROJECT_FAILURE,
  FETCH_PROJECT_METRICS_REQUEST,
  FETCH_PROJECT_METRICS_SUCCESS,
  FETCH_PROJECT_METRICS_FAILURE,
  FETCH_PROJECT_TASKS_REQUEST,
  FETCH_PROJECT_TASKS_SUCCESS,
  FETCH_PROJECT_TASKS_FAILURE,
} from './actions';

// Add these type imports from your slices
import * as PF from './projectFiles/types'; // project files tab types
import * as TD from './taskDetails/types'; // task details modal types

const initialListState = { data: [], loading: false, error: null };

const initialState = {
  // ---------- CORE (unchanged paths for your selectors) ----------
  list: [],
  loading: false,
  error: null,

  metricsById: {},
  metricsLoadingById: {},
  metricsErrorById: {},

  tasksById: {},
  tasksLoadingById: {},
  tasksErrorById: {},

  // ---------- PROJECT FILES (Files tab) ----------
  files: {
    byProject: {}, // { [projectId]: File[] }
    loading: false,
    uploading: false,
    error: null,
  },

  // ---------- TASK DETAILS (modal tabs) ----------
  taskDetails: {
    files: { ...initialListState },
    subtasks: { ...initialListState },
    timesheets: { ...initialListState },
    notes: { ...initialListState },
  },
};

export default function projectsReducer(state = initialState, action) {
  switch (action.type) {
    /* ===================== CORE (your existing code) ===================== */
    case FETCH_PROJECTS_REQUEST:
      return { ...state, loading: true, error: null };
    case FETCH_PROJECTS_SUCCESS:
      return { ...state, loading: false, list: action.payload, error: null };
    case FETCH_PROJECTS_FAILURE:
      return { ...state, loading: false, error: action.error };

    case TOGGLE_PIN_PROJECT_REQUEST: {
      const { projectId, desiredPinned } = action;
      return {
        ...state,
        list: state.list.map(p =>
          p.id === projectId
            ? {
                ...p,
                pinned: desiredPinned,
                pinnedAt: desiredPinned ? new Date().toISOString() : null,
              }
            : p,
        ),
      };
    }
    case TOGGLE_PIN_PROJECT_SUCCESS:
      return state;
    case TOGGLE_PIN_PROJECT_FAILURE: {
      const { projectId, prevPinned } = action;
      return {
        ...state,
        list: state.list.map(p =>
          p.id === projectId
            ? {
                ...p,
                pinned: prevPinned,
                pinnedAt: prevPinned
                  ? p.pinnedAt || new Date().toISOString()
                  : null,
              }
            : p,
        ),
        error: action.error || null,
      };
    }

    case FETCH_PROJECT_METRICS_REQUEST: {
      const id = action.projectId;
      return {
        ...state,
        metricsLoadingById: { ...state.metricsLoadingById, [id]: true },
        metricsErrorById: { ...state.metricsErrorById, [id]: null },
      };
    }
    case FETCH_PROJECT_METRICS_SUCCESS: {
      const { projectId, payload } = action;
      return {
        ...state,
        metricsById: { ...state.metricsById, [projectId]: payload },
        metricsLoadingById: { ...state.metricsLoadingById, [projectId]: false },
      };
    }
    case FETCH_PROJECT_METRICS_FAILURE: {
      const { projectId, error } = action;
      return {
        ...state,
        metricsLoadingById: { ...state.metricsLoadingById, [projectId]: false },
        metricsErrorById: {
          ...state.metricsErrorById,
          [projectId]: error || 'Failed to load',
        },
      };
    }

    case FETCH_PROJECT_TASKS_REQUEST: {
      const id = action.projectId;
      return {
        ...state,
        tasksLoadingById: { ...state.tasksLoadingById, [id]: true },
        tasksErrorById: { ...state.tasksErrorById, [id]: null },
      };
    }
    case FETCH_PROJECT_TASKS_SUCCESS: {
      const { projectId, payload } = action;
      return {
        ...state,
        tasksById: { ...state.tasksById, [projectId]: payload || [] },
        tasksLoadingById: { ...state.tasksLoadingById, [projectId]: false },
      };
    }
    case FETCH_PROJECT_TASKS_FAILURE: {
      const { projectId, error } = action;
      return {
        ...state,
        tasksLoadingById: { ...state.tasksLoadingById, [projectId]: false },
        tasksErrorById: {
          ...state.tasksErrorById,
          [projectId]: error || 'Failed to load',
        },
      };
    }

    /* ===================== PROJECT FILES ===================== */
    case PF.FETCH_PROJECT_FILES_REQUEST:
      return {
        ...state,
        files: { ...state.files, loading: true, error: null },
      };
    case PF.FETCH_PROJECT_FILES_SUCCESS: {
      const { projectId, items } = action.payload;
      return {
        ...state,
        files: {
          ...state.files,
          loading: false,
          byProject: { ...state.files.byProject, [projectId]: items || [] },
        },
      };
    }
    case PF.FETCH_PROJECT_FILES_FAILURE:
      return {
        ...state,
        files: { ...state.files, loading: false, error: action.error },
      };

    case PF.UPLOAD_PROJECT_FILE_REQUEST:
      return {
        ...state,
        files: { ...state.files, uploading: true, error: null },
      };
    case PF.UPLOAD_PROJECT_FILE_SUCCESS: {
      const item = action.payload.item;
      const arr = state.files.byProject[item.projectId] || [];
      return {
        ...state,
        files: {
          ...state.files,
          uploading: false,
          byProject: {
            ...state.files.byProject,
            [item.projectId]: [item, ...arr],
          },
        },
      };
    }
    case PF.UPLOAD_PROJECT_FILE_FAILURE:
      return {
        ...state,
        files: { ...state.files, uploading: false, error: action.error },
      };

    /* ===================== TASK DETAILS (modal) ===================== */
    // Files
    case TD.FETCH_TASK_FILES_REQUEST:
      return {
        ...state,
        taskDetails: {
          ...state.taskDetails,
          files: { ...state.taskDetails.files, loading: true, error: null },
        },
      };
    case TD.FETCH_TASK_FILES_SUCCESS:
      return {
        ...state,
        taskDetails: {
          ...state.taskDetails,
          files: { data: action.payload, loading: false, error: null },
        },
      };
    case TD.FETCH_TASK_FILES_FAILURE:
      return {
        ...state,
        taskDetails: {
          ...state.taskDetails,
          files: {
            ...state.taskDetails.files,
            loading: false,
            error: action.error,
          },
        },
      };

    case TD.UPLOAD_TASK_FILE_REQUEST:
      return {
        ...state,
        taskDetails: {
          ...state.taskDetails,
          files: { ...state.taskDetails.files, loading: true, error: null },
        },
      };
    case TD.UPLOAD_TASK_FILE_SUCCESS:
      return {
        ...state,
        taskDetails: {
          ...state.taskDetails,
          files: {
            data: [action.payload, ...state.taskDetails.files.data],
            loading: false,
            error: null,
          },
        },
      };
    case TD.UPLOAD_TASK_FILE_FAILURE:
      return {
        ...state,
        taskDetails: {
          ...state.taskDetails,
          files: {
            ...state.taskDetails.files,
            loading: false,
            error: action.error,
          },
        },
      };

    // Subtasks
    case TD.FETCH_SUBTASKS_REQUEST:
      return {
        ...state,
        taskDetails: {
          ...state.taskDetails,
          subtasks: {
            ...state.taskDetails.subtasks,
            loading: true,
            error: null,
          },
        },
      };
    case TD.FETCH_SUBTASKS_SUCCESS:
      return {
        ...state,
        taskDetails: {
          ...state.taskDetails,
          subtasks: { data: action.payload, loading: false, error: null },
        },
      };
    case TD.FETCH_SUBTASKS_FAILURE:
      return {
        ...state,
        taskDetails: {
          ...state.taskDetails,
          subtasks: {
            ...state.taskDetails.subtasks,
            loading: false,
            error: action.error,
          },
        },
      };

    case TD.CREATE_SUBTASK_REQUEST:
      return {
        ...state,
        taskDetails: {
          ...state.taskDetails,
          subtasks: {
            ...state.taskDetails.subtasks,
            loading: true,
            error: null,
          },
        },
      };
    case TD.CREATE_SUBTASK_SUCCESS:
      return {
        ...state,
        taskDetails: {
          ...state.taskDetails,
          subtasks: {
            data: [action.payload, ...state.taskDetails.subtasks.data],
            loading: false,
            error: null,
          },
        },
      };
    case TD.CREATE_SUBTASK_FAILURE:
      return {
        ...state,
        taskDetails: {
          ...state.taskDetails,
          subtasks: {
            ...state.taskDetails.subtasks,
            loading: false,
            error: action.error,
          },
        },
      };

    // Timesheets
    case TD.FETCH_TIMESHEETS_REQUEST:
      return {
        ...state,
        taskDetails: {
          ...state.taskDetails,
          timesheets: {
            ...state.taskDetails.timesheets,
            loading: true,
            error: null,
          },
        },
      };
    case TD.FETCH_TIMESHEETS_SUCCESS:
      return {
        ...state,
        taskDetails: {
          ...state.taskDetails,
          timesheets: { data: action.payload, loading: false, error: null },
        },
      };
    case TD.FETCH_TIMESHEETS_FAILURE:
      return {
        ...state,
        taskDetails: {
          ...state.taskDetails,
          timesheets: {
            ...state.taskDetails.timesheets,
            loading: false,
            error: action.error,
          },
        },
      };

    // Notes
    case TD.FETCH_NOTES_REQUEST:
      return {
        ...state,
        taskDetails: {
          ...state.taskDetails,
          notes: { ...state.taskDetails.notes, loading: true, error: null },
        },
      };
    case TD.FETCH_NOTES_SUCCESS:
      return {
        ...state,
        taskDetails: {
          ...state.taskDetails,
          notes: { data: action.payload, loading: false, error: null },
        },
      };
    case TD.FETCH_NOTES_FAILURE:
      return {
        ...state,
        taskDetails: {
          ...state.taskDetails,
          notes: {
            ...state.taskDetails.notes,
            loading: false,
            error: action.error,
          },
        },
      };

    case TD.CREATE_NOTE_REQUEST:
      return {
        ...state,
        taskDetails: {
          ...state.taskDetails,
          notes: { ...state.taskDetails.notes, loading: true, error: null },
        },
      };
    case TD.CREATE_NOTE_SUCCESS:
      return {
        ...state,
        taskDetails: {
          ...state.taskDetails,
          notes: {
            data: [action.payload, ...state.taskDetails.notes.data],
            loading: false,
            error: null,
          },
        },
      };
    case TD.CREATE_NOTE_FAILURE:
      return {
        ...state,
        taskDetails: {
          ...state.taskDetails,
          notes: {
            ...state.taskDetails.notes,
            loading: false,
            error: action.error,
          },
        },
      };

    case TD.CLEAR_TASK_DETAILS:
      return {
        ...state,
        taskDetails: {
          files: { ...initialListState },
          subtasks: { ...initialListState },
          timesheets: { ...initialListState },
          notes: { ...initialListState },
        },
      };

    default:
      return state;
  }
}
