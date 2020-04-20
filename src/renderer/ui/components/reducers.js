import { actionTypes } from './actions';

export const initialState = {
  url: null,
  pending: false,
  error: null,
  stories: [],
  selectedItemId: null,
  selectedItem: null
};

const reducers = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.READ_RSS_PENDING:
      return {
        ...state,
        pending: true,
        url: action.url,
        selectedItemId: null,
        selectedItem: null
      };
    case actionTypes.READ_RSS_SUCCESS:
      return {
        ...state,
        pending: false,
        stories: action.stories
      };
    case actionTypes.READ_RSS_ERROR:
      return {
        ...state,
        pending: false,
        error: action.error
      };
    case actionTypes.SELECT_CONTENT_ITEM:
      return {
        ...state,
        selectedItemId: action.itemId,
        selectedItem: state.stories.find((story) => story.guid === action.itemId)
      };
    default:
      return state;
  }
};
export const getStories = (state) => state.stories;
export const getUrl = (state) => state.url;
export const getError = (state) => state.error;

export default reducers;
