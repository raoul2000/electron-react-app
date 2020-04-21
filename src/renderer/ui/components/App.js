import React from 'react';
import { Provider } from 'react-redux';
import FeedItem from './FeedItem';
import ItemsList from './ItemsList';
import ItemDetail from './ItemDetail';
import configureStore from './store';
import { readRssTask } from '../helper/task';

const store = configureStore();

const App = () => {
  return (
    <Provider store={store}>

      <div className="columns">
        <div className="column is-2">
          <div className="feeds-header">
            Feeds
          </div>
          <div className="feeds-list">
            <FeedItem name="Le Monde : La Une" url="https://www.lemonde.fr/rss/une.xml" />
          </div>
        </div>
        <div className="column is-3">
          <div className="list-header">
            result list
          </div>
          <div className="items-list">
            <ItemsList />
          </div>
        </div>
        <div className="column is-7">
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
