// Tsx:typescript + jsx 虚拟DOM
import React from 'react';
import ReactDOM from 'react-dom/client';
import './global.scss';
import App from './App.js';

const root = ReactDOM.createRoot(
  document.querySelector('#root')!,
);
root.render(<App />);

