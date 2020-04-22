import { readRssTask } from '../helper/task';

export const actionTypes = {
  READ_RSS_PENDING: 'READ_RSS_PENDING',
  READ_RSS_SUCCESS: 'READ_RSS_SUCCESS',
  READ_RSS_ERROR: 'READ_RSS_ERROR',
  SELECT_CONTENT_ITEM: 'SELECT_CONTENT_ITEM',
  SELECT_FEED_ITEM: 'SELECT_FEED_ITEM'
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
      if (res.error) {
        throw (res.error);
      }
      dispatch(readRssSuccess(res.items));
      return res.items;
    })
    .catch((error) => {
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

export default readRss;
