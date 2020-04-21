import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { selectContentItem } from './actions';

const ItemsList = ({ items, selectedItemId, onSelectItem }) => {
  const handleItemSelected = (ev, id) => {
    ev.preventDefault();
    onSelectItem(id);
  };
  // build the list of items
  const itemsComponents = items.map((item) => (
    <li key={item.guid} className={item.guid === selectedItemId ? 'selected' : ''}>
      <a href="/" onClick={(ev) => handleItemSelected(ev, item.guid)}>{item.title}</a>
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
  selectedItemId: PropTypes.string,
  onSelectItem: PropTypes.func.isRequired
};
ItemsList.defaultProps = {
  selectedItemId: null
};

const mapStateToProps = (state) => ({
  items: state.stories,
  selectedItemId: state.selectedItemId
});
const mapDispatchToProps = {
  onSelectItem: selectContentItem
};
export default connect(mapStateToProps, mapDispatchToProps)(ItemsList);
