import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { Router } from 'react-router'; //importamos react router
import { createBrowserHistory } from 'history'; //importamos history
import { createStore, compose } from 'redux';
import reducer from './reducers';
//import initialState from './initialState'; //importamos el initialState
import App from './routes/App';

const history = createBrowserHistory(); //llamamos a nuestra funcion

const preloadedState = window.__PRELOADED_STATE__;
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const store = createStore(reducer, preloadedState, composeEnhancers());

delete window.__PRELOADED_STATE__;

ReactDOM.hydrate(
  <Provider store={store}>
    <Router history={history}>
      <App />
    </Router>
  </Provider>,
  document.getElementById('app'),
);
