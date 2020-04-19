import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

const ItemDetail = ({ selectedItem }) => {
  console.log(selectedItem);
  return (
    <div>
      {selectedItem
        ? selectedItem.email
        : 'no selection'}
    </div>
  );
};

ItemDetail.propTypes = {
  selectedItem: PropTypes.shape({
    email: PropTypes.string
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
