//tsx:typescript + jsx 虚拟DOM
import React from 'react';
import ReactDOM from 'react-dom/client';
import './global.scss';
import App from './App';


const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(<App />);

