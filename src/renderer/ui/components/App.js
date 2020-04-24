import React from 'react';
import { Provider } from 'react-redux';
import ItemsList from './ItemsList';
import ItemDetail from './ItemDetail';
import configureStore from './store';
import FeedsList from './FeedsList';

const store = configureStore();

const App = () => (
  <Provider store={store}>
    <div className="columns">
      <div className="column is-2">
        <div className="col-header">
          <span role="img" aria-label="newspaper icon">📰 </span>
          Feeds
        </div>
        <div className="feeds-list">
          <FeedsList />
        </div>
      </div>
      <div className="column is-3">
        <div className="col-header">
          <span role="img" aria-label="pencil icon">✏️ </span>
          Topics
        </div>
        <div className="items-list">
          <ItemsList />
        </div>
      </div>
      <div className="column is-7">
        <div className="col-header">
          <span role="img" aria-label="article icon">👁️‍🗨️&nbsp;</span>
          Articles
        </div>
        <div className="item-detail">
          <ItemDetail />
        </div>
      </div>
    </div>
  </Provider>
);

export default App;
