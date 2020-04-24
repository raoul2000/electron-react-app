import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { selectContentItem } from './actions';

const ItemsList = ({
  items, selectedItemId, onSelectItem, isPending, error
}) => {
  const handleItemSelected = (ev, id) => {
    ev.preventDefault();
    onSelectItem(id);
  };
  let listContent = null;
  if (isPending) {
    listContent = <div>loading ...</div>;
  } else if (error) {
    listContent = <div>ERROR </div>;
  } else if (items && items.length !== 0) {
    // build the list of items
    listContent = items.map((item) => (
      <li key={item.guid} className={item.guid === selectedItemId ? 'selected' : ''}>
        <a href="/" onClick={(ev) => handleItemSelected(ev, item.guid)}>{item.title}</a>
      </li>
    ));
  } else {
    listContent = <div>please select a feed</div>;
  }

  return (
    <ul>
      {listContent}
    </ul>
  );
};

ItemsList.propTypes = {
  items: PropTypes.arrayOf(PropTypes.object).isRequired,
  selectedItemId: PropTypes.string,
  onSelectItem: PropTypes.func.isRequired,
  isPending: PropTypes.bool.isRequired,
  error: PropTypes.string
};
ItemsList.defaultProps = {
  selectedItemId: null,
  error: null
};

const mapStateToProps = (state) => ({
  items: state.stories,
  isPending: state.pending,
  error: state.error,
  selectedItemId: state.selectedItemId
});
const mapDispatchToProps = {
  onSelectItem: selectContentItem
};
export default connect(mapStateToProps, mapDispatchToProps)(ItemsList);
