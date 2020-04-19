import React from 'react';
import { Provider } from 'react-redux';
import FeedItem from './FeedItem';
import ItemsList from './ItemsList';
import ItemDetail from './ItemDetail';
import configureStore from './store';
import { readRss } from '../helper/task';

const store = configureStore();

const App = () => {
  const handleReadRss = () => {
    readRss('https://www.reddit.com/.rss')
      .then((result) => {
        console.log(result);
      });
  };

  return (
    <Provider store={store}>
      <button type="button" onClick={handleReadRss}>read rss</button>
      <div className="columns">
        <div className="column is-3">
          <div className="feeds-header">
            Feeds
          </div>
          <div className="feeds-list">
            <FeedItem name="Friends" url="https://randomuser.me/api/?results=50" />
          </div>
        </div>
        <div className="column is-4">
          <div className="list-header">
            result list
          </div>
          <div className="items-list">
            <ItemsList />
          </div>
        </div>
        <div className="column is-5">
          <div className="list-header">
            detail
          </div>
          <div className="item-detail">
            <ItemDetail />
          </div>
        </div>
      </div>
    </Provider>
  );
};

export default App;
