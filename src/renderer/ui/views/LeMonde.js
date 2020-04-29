import React from 'react';
import ItemsList from '../components/ItemsList';
import ItemDetail from '../components/ItemDetail';
import FeedsList from '../components/FeedsList';

const LeMonde = () => (
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
);

export default LeMonde;
