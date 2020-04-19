import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import readRss from './actions';

const FeedItem = ({ name, url, onReadRss }) => {
  const handleClick = () => {
    onReadRss(url);
  };

  return (
    <div className="feed-item" onClick={handleClick} role="button" onKeyPress={handleClick} tabIndex={0}>
      {name}
    </div>
  );
};

FeedItem.propTypes = {
  name: PropTypes.string.isRequired,
  url: PropTypes.string.isRequired,
  onReadRss: PropTypes.func.isRequired
};

const mapStateToProps = () => ({});

const mapDispatchToProps = {
  onReadRss: readRss
};

export default connect(mapStateToProps, mapDispatchToProps)(FeedItem);
