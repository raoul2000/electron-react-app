import { actionTypes } from './actions';

export const initialState = {
  selectedFeedTitle: null,
  url: null,
  pending: false,
  error: null,
  stories: [],
  selectedItemId: null,
  selectedItem: null,
  subscription: {
    enabled: false,
    value: 0
  },
  taskList: [
    {
      id: 'id-1',
      type: 'task-type',
      description: 'a simple task',
      arg: { value: 1 },
      interval: 2,
      subscribe: true,
      result: null,
      error: null
    },
    {
      id: 'id-2',
      type: 'task-type (2)',
      description: 'another simple task',
      arg: { value: 1 },
      interval: 2,
      subscribe: true,
      result: null,
      error: null
    }
  ]
};

const reducers = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.READ_RSS_PENDING:
      return {
        ...state,
        pending: true,
        error: null,
        url: action.url,
        selectedItemId: null,
        selectedItem: null
      };
    case actionTypes.READ_RSS_SUCCESS:
      return {
        ...state,
        pending: false,
        error: null,
        stories: action.stories
      };
    case actionTypes.READ_RSS_ERROR:
      return {
        ...state,
        pending: false,
        error: action.error,
        stories: []
      };
    case actionTypes.SELECT_CONTENT_ITEM:
      return {
        ...state,
        selectedItemId: action.itemId,
        selectedItem: state.stories.find((story) => story.guid === action.itemId)
      };
    case actionTypes.SELECT_FEED_ITEM:
      return {
        ...state,
        selectedFeedTitle: action.feedTitle
      };
    case actionTypes.SUBSCRIBE:
      return {
        ...state,
        subscription: {
          ...state.subscription,
          enabled: true,
          value: action.value
        }
      };
    case actionTypes.UNSUBSCRIBE:
      return {
        ...state,
        subscription: {
          ...state.subscription,
          enabled: false
        }
      };
    case actionTypes.PLAY_TASK:
      return {
        ...state,
        taskList: state.taskList.map((item) => {
          if (item.id === action.payload.taskId) {
            return Object.assign(item, { subscribe: true });
          }
          return item;
        })
      };
    case actionTypes.STOP_TASK:
      return {
        ...state,
        taskList: state.taskList.map((item) => {
          if (item.id === action.payload.taskId) {
            return Object.assign(item, { subscribe: false });
          }
          return item;
        })
      };
    case actionTypes.RESULT_TASK:
      return {
        ...state,
        taskList: state.taskList.map((item) => {
          if (item.id === action.payload.taskId) {
            return Object.assign(item, {
              result: action.payload.result,
              error: null
            });
          }
          return item;
        })
      };
    case actionTypes.ERROR_TASK:
      return {
        ...state,
        taskList: state.taskList.map((item) => {
          if (item.id === action.payload.taskId) {
            return Object.assign(item, {
              error: action.payload.error,
              result: null
            });
          }
          return item;
        })
      };
    default:
      return state;
  }
};
export const getStories = (state) => state.stories;
export const getUrl = (state) => state.url;
export const getError = (state) => state.error;

export default reducers;
