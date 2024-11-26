import React from 'react';
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import Homepage from './page/Homepage/index.js';
import Advertisementpage from './page/Advertisement/index.js';
import Downloadpage from './page/Download/index.js';
import Domainpage from './page/Domain/index.js';
import Mirrorpage from './page/Mirror/index.js';
import Statepage from './page/State/state.js';

function App() {
  return (
    <Router>
      <Routes>
        <Route path='/' element={<Homepage />} />
        <Route path='/announcement' element={<Advertisementpage />} />
        <Route path='/download' element={<Downloadpage />} />"
        <Route path='/domain' element={<Domainpage />} />
        <Route path='/mirror' element={<Mirrorpage />} />
        <Route path='/state' element={<Statepage />} />
      </Routes >
    </Router>
  );
}

export default App;
