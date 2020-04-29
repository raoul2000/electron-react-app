import React from 'react';
import { Provider } from 'react-redux';
import {
  HashRouter as Router,
  Switch,
  Route,
  Link
} from 'react-router-dom';
import configureStore from './components/store';
import LeMonde from './views/LeMonde';
import Subscriber from './views/Subscriber';


const store = configureStore();

const App = () => (
  <Provider store={store}>
    <Router>
      <div>
        <nav className="navbar is-fixed-top is-dark" role="navigation" aria-label="main navigation">
          <div className="navbar-brand">
            <Link className="navbar-item" to="/le-monde">Le Monde</Link>
            <Link className="navbar-item" to="/subscriber">Subscriber</Link>
          </div>
        </nav>
        <div className="main-content">
          <Switch>
            <Route path="/le-monde">
              <LeMonde />
            </Route>
            <Route path="/subscriber">
              <Subscriber />
            </Route>
          </Switch>
        </div>
      </div>
    </Router>
  </Provider>
);

export default App;
