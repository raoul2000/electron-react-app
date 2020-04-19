import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { selectContentItem } from './actions';

const ItemsList = ({ items, onSelectItem }) => {
  const handleItemSelected = (email) => {
    onSelectItem(email);
  };
  const itemsComponents = items.map((item) => (
    <li key={item.email}>
      <button type="button" onClick={() => handleItemSelected(item.email)}>
        {item.name.first}
      </button>
    </li>
  ));

  return (
    <ul>
      {itemsComponents}
    </ul>
  );
};

ItemsList.propTypes = {
  items: PropTypes.arrayOf(PropTypes.object).isRequired,
  onSelectItem: PropTypes.func.isRequired
};

const mapStateToProps = (state) => ({
  items: state.stories
});
const mapDispatchToProps = {
  onSelectItem: selectContentItem
};
export default connect(mapStateToProps, mapDispatchToProps)(ItemsList);
