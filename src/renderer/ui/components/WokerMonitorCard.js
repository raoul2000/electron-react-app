import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

const WorkerMonitorCard = (queueInfo) => {
  console.log('worker monitor');

  // TODO: about effect with cleanup @see https://fr.reactjs.org/docs/hooks-effect.html
  /*   useEffect(() => {
      subscribeToMonitorInfo();
      return () => {
        unsubscribeFromMonitorInfo();
      };
    }); */
  return (
    <div className="card">
      <header className="card-header">
        <p className="card-header-title">
          Worker status
        </p>
      </header>
      <div className="card-content">
        <div className="content">
          concurrency :
          {queueInfo.concurrency}
        </div>
      </div>
      <footer className="card-footer">
        <p className="card-header-title">
          Sample Task List
        </p>
      </footer>
    </div>
  );
};

WorkerMonitorCard.propTypes = {
  queueInfo: PropTypes.shape({
    concurrency: PropTypes.number.isRequired,
    size: PropTypes.number.isRequired,
    pending: PropTypes.number.isRequired,
    isPaused: PropTypes.bool.isRequired,
    isIdle: PropTypes.bool.isRequired
  })
};

WorkerMonitorCard.defaultProps = {
  queueInfo: {
    concurrency: 0,
    size: 0,
    pending: 0,
    isPaused: false,
    isIdle: false
  }
};

const mapStateToProps = (state) => ({
  queueInfo: state.queueInfo
});

export default connect(mapStateToProps)(WorkerMonitorCard);
