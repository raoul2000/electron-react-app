import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { subscribe, unsubscribe } from './actions';

const SubscriberCard = ({
  onSubscribe, onUnsubscribe, initialValue, currentValue, isSubscribed
}) => {
  const handleClickSubscribe = () => {
    onSubscribe(initialValue, 2);
  };
  const handleClickUnsubscribe = () => {
    onUnsubscribe();
  };
  return (
    <div className="card">
      <header className="card-header">
        <p className="card-header-title">
          Subscriber
        </p>
      </header>
      <div className="card-content">
        <div className="content">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus nec iaculis mauris.
          <div className="has-text-centered is-size-3">
            {currentValue}
          </div>
        </div>
      </div>
      <footer className="card-footer">
        <div className="buttons">
          <button
            className="button is-white"
            type="button"
            disabled={isSubscribed}
            onClick={handleClickSubscribe}
          >
            Subscribe
          </button>
          <button
            className="button is-white"
            type="button"
            disabled={!isSubscribed}
            onClick={handleClickUnsubscribe}
          >
            Unsubscribe
          </button>
        </div>
      </footer>
    </div>
  );
};

SubscriberCard.propTypes = {
  onSubscribe: PropTypes.func.isRequired,
  onUnsubscribe: PropTypes.func.isRequired,
  initialValue: PropTypes.number.isRequired,
  currentValue: PropTypes.number.isRequired,
  isSubscribed: PropTypes.bool.isRequired
};

const mapStateToProps = (state) => ({
  currentValue: state.subscription.value,
  isSubscribed: state.subscription.enabled
});

const mapDispatchToProps = {
  onSubscribe: subscribe,
  onUnsubscribe: unsubscribe
};
export default connect(mapStateToProps, mapDispatchToProps)(SubscriberCard);
