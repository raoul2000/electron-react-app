import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import FeedItem from './FeedItem';

const feeds = [
  { title: 'La Une France', url: 'https://www.lemonde.fr/rss/une.xml__' },
  { title: 'La Une International', url: 'https://www.lemonde.fr/international/rss_full.xml' },
  { title: 'vidéo', url: 'https://www.lemonde.fr/videos/rss_full.xml' },
  { title: 'France: Les Décodeurs', url: 'https://www.lemonde.fr/les-decodeurs/rss_full.xml' },
  { title: 'La Une: Planète', url: 'https://www.lemonde.fr/planete/rss_full.xml' },
  { title: 'La Une: Science', url: 'https://www.lemonde.fr/sciences/rss_full.xml' }
];

const FeedsList = ({ selectedFeedTitle }) => (
  <div>
    {feeds.map((feed) => (
      <div key={feed.title} className={feed.title === selectedFeedTitle ? 'selected' : null}>
        <FeedItem name={feed.title} url={feed.url} />
      </div>
    ))}
  </div>
);


FeedsList.propTypes = {
  selectedFeedTitle: PropTypes.string
};

FeedsList.defaultProps = {
  selectedFeedTitle: null
};

const mapStateToProps = (state) => ({
  selectedFeedTitle: state.selectedFeedTitle
});

export default connect(mapStateToProps)(FeedsList);
