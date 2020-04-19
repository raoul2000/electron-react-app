export const actionTypes = {
  READ_RSS_PENDING: 'READ_RSS_PENDING',
  READ_RSS_SUCCESS: 'READ_RSS_SUCCESS',
  READ_RSS_ERROR: 'READ_RSS_ERROR'
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
  fetch(url)
    .then((res) => res.json())
    .then((res) => {
      if (res.error) {
        throw (res.error);
      }
      // debugger;
      dispatch(readRssSuccess(res.results));
      return res.results;
    })
    .catch((error) => {
      dispatch(readRssError(error));
    });
};

export default readRss;
