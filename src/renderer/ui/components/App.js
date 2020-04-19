import React from 'react';
import { Provider } from 'react-redux';
import FeedItem from './FeedItem';
import configureStore from './store';

const store = configureStore();

const App = () => {
  console.log('App');
  return (
    <Provider store={store}>
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
          result list
        </div>
        <div className="column is-5">
          detail
        </div>
      </div>
    </Provider>
  );
};

export default App;
