import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import Routes from './components/router/Routes';
import * as serviceWorker from './serviceWorker';

ReactDOM.render(
  <Routes/>,
  document.getElementById('root')
);
serviceWorker.unregister();
