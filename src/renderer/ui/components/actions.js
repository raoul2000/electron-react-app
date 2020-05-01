import { readRssTask } from '../helper/task';
import { subscribe as subscribeTask, unsubscribe as unsubscribeTask } from '../helper/subscription';

export const actionTypes = {
  READ_RSS_PENDING: 'READ_RSS_PENDING',
  READ_RSS_SUCCESS: 'READ_RSS_SUCCESS',
  READ_RSS_ERROR: 'READ_RSS_ERROR',
  SELECT_CONTENT_ITEM: 'SELECT_CONTENT_ITEM',
  SELECT_FEED_ITEM: 'SELECT_FEED_ITEM',
  SUBSCRIBE: 'SUBSCRIBE',
  UNSUBSCRIBE: 'UNSUBSCRIBE'
};

const readRssPending = (url) => ({
  type: actionTypes.READ_RSS_PENDING,
  url
});

const readRssSuccess = (stories) => ({
  type: actionTypes.READ_RSS_SUCCESS,
  stories
});

const readRssError = (error) => ({
  type: actionTypes.READ_RSS_ERROR,
  error
});

const readRss = (url) => (dispatch) => {
  dispatch(readRssPending(url));

  readRssTask(url)
    .then((res) => {
      console.log(res);
      if (res.error) {
        throw (res.error);
      }
      dispatch(readRssSuccess(res.items));
      return res.items;
    })
    .catch((error) => {
      console.error(url, error);
      dispatch(readRssError(error));
    });
};

export const selectContentItem = (itemId) => ({
  type: actionTypes.SELECT_CONTENT_ITEM,
  itemId
});

export const selectFeedItem = (feedTitle) => ({
  type: actionTypes.SELECT_FEED_ITEM,
  feedTitle
});

export const subscribe = (value, increment) => (dispatch) => {
  subscribeTask({ value, increment }, (error, newValue) => {
    if (newValue !== null) {
      console.log(`dispatching value = ${newValue}`);
      dispatch({
        type: actionTypes.SUBSCRIBE,
        value: newValue
      });
    }
  });
};

export const unsubscribe = () => (dispatch) => {
  unsubscribeTask();
  dispatch({ type: actionTypes.UNSUBSCRIBE });
};

export default readRss;
