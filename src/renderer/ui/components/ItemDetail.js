import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

const ItemDetail = ({ selectedItem }) => {
  console.log(selectedItem);

  if (selectedItem === null) {
    return <div>no selection</div>;
  }

  let media = null;
  if (selectedItem['media:content']) {
    let caption = null;
    if (selectedItem['media:content']['media:description']) {
      caption = (
        <figcaption>
          {selectedItem['media:content']['media:description'][0]['_']}
        </figcaption>
      );
    }
    media = (
      <div className="media">
        <figure className="image">
          <img src={selectedItem['media:content'].$.url} title={selectedItem.title} alt={selectedItem.title} />
        </figure>
        {caption}
      </div>
    );
  }
  return (
    <article>
      <h1 className="title">{selectedItem.title}</h1>
      {media}
      <p>{selectedItem.content}</p>
      <div className="is-small">{selectedItem.pubDate}</div>
      <a href={selectedItem.link} data-open-external="true">lire l&apos;article</a>
    </article>
  );
};

ItemDetail.propTypes = {
  selectedItem: PropTypes.shape({
    title: PropTypes.string,
    link: PropTypes.string,
    content: PropTypes.string,
    pubDate: PropTypes.string
  })
};

ItemDetail.defaultProps = {
  selectedItem: null
};

const mapStateToProps = (state) => ({
  itemId: state.selectedItemId,
  selectedItem: state.selectedItem
});
export default connect(mapStateToProps)(ItemDetail);
