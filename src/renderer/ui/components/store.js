import { applyMiddleware, compose, createStore } from 'redux';
import thunk from 'redux-thunk';
import reducers, { initialState } from './reducers';

const configureStore = () => {
  const middleware = [thunk];
  const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
  const store = createStore(reducers, initialState, composeEnhancers(applyMiddleware(...middleware)));
  return store;
};

export default configureStore;
